// Supabase Edge Function: user management for the My Mac-ro's admin app.
// Runs on Supabase's servers with the service-role key (never sent to browsers)
// and only acts for callers whose profile has role = 'admin'.
//
// Deploy: Supabase dashboard -> Edge Functions -> Deploy a new function ->
// "Via Editor", name it admin-users, paste this file, Deploy.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

// Banned users can't sign in; ~100 years is effectively permanent until re-enabled.
const BAN_FOREVER = '876000h';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    // Projects on Supabase's newer API keys may expose the server key under a different name.
    const serverKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SECRET_KEY');
    if (!serverKey) return json({ error: 'Server key not available to the function (SUPABASE_SERVICE_ROLE_KEY).' }, 500);
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, serverKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const jwt = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    const { data: { user: caller }, error: authError } = await admin.auth.getUser(jwt);
    if (authError || !caller) return json({ error: 'Please sign in again.' }, 401);
    const { data: me } = await admin.from('profiles').select('role, disabled').eq('id', caller.id).single();
    if (!me || me.role !== 'admin' || me.disabled) return json({ error: 'Admins only.' }, 403);

    const body = await req.json();
    switch (body.action) {
      case 'list': {
        const users = [];
        for (let page = 1; ; page++) {
          const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
          if (error) throw error;
          users.push(...data.users);
          if (data.users.length < 1000) break;
        }
        const { data: profiles, error: pErr } = await admin.from('profiles').select('*');
        if (pErr) throw pErr;
        const { data: rows, error: dErr } = await admin.from('user_data').select('user_id, updated_at');
        if (dErr) throw dErr;
        const byId = new Map(profiles.map((p) => [p.id, p]));
        const activity = new Map(rows.map((r) => [r.user_id, r.updated_at]));
        return json({
          users: users.map((u) => {
            const p = byId.get(u.id) || {};
            return {
              id: u.id,
              email: u.email,
              display_name: p.display_name || '',
              role: p.role || 'user',
              disabled: !!p.disabled,
              confirmed: !!u.email_confirmed_at,
              created_at: u.created_at,
              last_sign_in_at: u.last_sign_in_at || null,
              data_updated_at: activity.get(u.id) || null,
            };
          }),
        });
      }

      case 'create': {
        const email = String(body.email || '').trim().toLowerCase();
        const password = String(body.password || '');
        if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'Enter a valid email address.' }, 400);
        if (password.length < 8) return json({ error: 'Password must be at least 8 characters.' }, 400);
        const { data, error } = await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { display_name: body.display_name || '' },
        });
        if (error) throw error;
        const updates: Record<string, unknown> = {};
        if (body.display_name) updates.display_name = body.display_name;
        if (body.role === 'admin') updates.role = 'admin';
        if (Object.keys(updates).length) {
          const { error: upErr } = await admin.from('profiles').update(updates).eq('id', data.user.id);
          if (upErr) throw upErr;
        }
        return json({ id: data.user.id });
      }

      case 'update': {
        const id = String(body.id || '');
        if (!id) return json({ error: 'Missing user.' }, 400);
        if (id === caller.id && (body.role === 'user' || body.disabled === true)) {
          return json({ error: "You can't remove your own admin access or disable yourself." }, 400);
        }
        const authUpdates: Record<string, unknown> = {};
        if (body.password !== undefined) {
          if (String(body.password).length < 8) return json({ error: 'Password must be at least 8 characters.' }, 400);
          authUpdates.password = String(body.password);
        }
        if (body.disabled !== undefined) authUpdates.ban_duration = body.disabled ? BAN_FOREVER : 'none';
        if (Object.keys(authUpdates).length) {
          const { error } = await admin.auth.admin.updateUserById(id, authUpdates);
          if (error) throw error;
        }
        const profileUpdates: Record<string, unknown> = {};
        if (body.display_name !== undefined) profileUpdates.display_name = String(body.display_name);
        if (body.role === 'user' || body.role === 'admin') profileUpdates.role = body.role;
        if (body.disabled !== undefined) profileUpdates.disabled = !!body.disabled;
        if (Object.keys(profileUpdates).length) {
          const { error } = await admin.from('profiles').update(profileUpdates).eq('id', id);
          if (error) throw error;
        }
        return json({ ok: true });
      }

      case 'delete': {
        const id = String(body.id || '');
        if (!id) return json({ error: 'Missing user.' }, 400);
        if (id === caller.id) return json({ error: "You can't delete your own account here." }, 400);
        const { error } = await admin.auth.admin.deleteUser(id);
        if (error) throw error;
        return json({ ok: true });
      }

      default:
        return json({ error: 'Unknown action.' }, 400);
    }
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 400);
  }
});

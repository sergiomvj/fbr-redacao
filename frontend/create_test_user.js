import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54341';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createMockUser() {
    console.log("Creating test user in Supabase Auth...");
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'operador@facebrasil.com',
        password: 'password123',
        email_confirm: true
    });

    if (authError) {
        if (authError.message.includes('already exists')) {
            console.log("User already exists. Skipping auth creation.");
            const { data: users } = await supabase.auth.admin.listUsers();
            const existingUser = users.users.find(u => u.email === 'operador@facebrasil.com');
            if (existingUser) {
                console.log("Found existing user id:", existingUser.id);
            }
            return;
        } else {
            console.error("Auth Error:", authError);
            return;
        }
    }

    console.log("Mock user created:", authData.user.id);

    // In our project, the 'users' public table is either populated by a trigger 
    // or manually inserted. We have a 'handle_new_user' trigger!
    // Let's update the public users table role to 'operator' explicitly just in case.
    if (authData.user) {
        console.log("Updating role -> operator in public.users...");
        const { error: updateError } = await supabase
            .from('users')
            .update({ role: 'operator', plan: 'pro' })
            .eq('auth_id', authData.user.id);

        if (updateError) console.error("Update Error:", updateError);
        else console.log("User successfully promoted to operator.");
    }
}

createMockUser();

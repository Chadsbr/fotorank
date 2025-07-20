// Importar Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Configurar Supabase (vamos pegar do servidor depois)
const supabaseUrl = 'https://xsmnkhfhiggaqykehysi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbW5raGZoaWdnYXF5a2VoeXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODgxMTMsImV4cCI6MjA2ODU2NDExM30.xQLCUpjfLguTweV9AQbTNHyI74F1oTj_zzBvCgbO3C8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Validar username
function validateUsername(username) {
    const regex = /^[a-zA-Z]{3,14}$/;
    return regex.test(username);
}

// Formulário de cadastro
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Limpar erros
        document.getElementById('usernameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';
        
        // Validar username
        if (!validateUsername(username)) {
            document.getElementById('usernameError').textContent = 'Username deve ter apenas letras, 3-14 caracteres';
            return;
        }
        
        try {
            // Criar usuário no Supabase
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username
                    }
                }
            });
            
            if (error) throw error;
            
            // Sucesso!
            document.getElementById('message').innerHTML = '<div class="success">Conta criada! Verifique seu email.</div>';
            signupForm.reset();
            
        } catch (error) {
            document.getElementById('message').innerHTML = `<div class="error">${error.message}</div>`;
        }
    });
}

// Formulário de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            // Login bem sucedido!
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            document.getElementById('message').innerHTML = `<div class="error">${error.message}</div>`;
        }
    });
}
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://xsmnkhfhiggaqykehysi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbW5raGZoaWdnYXF5a2VoeXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODgxMTMsImV4cCI6MjA2ODU2NDExM30.xQLCUpjfLguTweV9AQbTNHyI74F1oTj_zzBvCgbO3C8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuração Cloudinary (temporária - depois vamos melhorar)
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dwwzayj0v/image/upload';
const CLOUDINARY_PRESET = 'fotorank_preset';

let selectedFile = null;
let selectedCategory = null;
let selectedType = null;
let currentUser = null;
let userProfile = null;

// Verificar login
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = user;
    
    // Buscar perfil
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
    userProfile = profile;
    document.getElementById('userKarma').textContent = profile.karma;
    document.getElementById('userCredits').textContent = profile.credits;
}

// Upload area
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const previewImg = document.getElementById('previewImg');

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

function handleFile(file) {
    if (file.size > 20 * 1024 * 1024) {
        alert('Arquivo muito grande! Máximo 20MB');
        return;
    }
    
    selectedFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewContainer.style.display = 'block';
        checkFormValidity();
    };
    reader.readAsDataURL(file);
}

// Category selection
document.querySelectorAll('.category-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedCategory = option.dataset.category;
        checkFormValidity();
    });
});

// Test type selection
document.querySelectorAll('.test-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.test-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedType = option.dataset.type;
        checkFormValidity();
    });
});

// Check if form is valid
function checkFormValidity() {
    const age = document.getElementById('ageInput').value;
    const isValid = selectedFile && selectedCategory && selectedType && age;
    document.getElementById('submitBtn').disabled = !isValid;
}

document.getElementById('ageInput').addEventListener('input', checkFormValidity);

// Submit
document.getElementById('submitBtn').addEventListener('click', async () => {
    const age = parseInt(document.getElementById('ageInput').value);
    const messageDiv = document.getElementById('message');
    
    // Validações
    if (selectedType === 'karma' && userProfile.karma < 1) {
        messageDiv.innerHTML = '<div class="error">Você não tem karma suficiente!</div>';
        return;
    }
    
    if (selectedType === 'premium' && userProfile.credits < 20) {
        messageDiv.innerHTML = '<div class="error">Você não tem créditos suficientes!</div>';
        return;
    }
    
    try {
        messageDiv.innerHTML = '<div>Enviando foto...</div>';
        
        // Por enquanto vamos simular o upload
        // Na próxima etapa configuramos o Cloudinary real
        const fakeCloudinaryUrl = 'https://via.placeholder.com/400';
        
        // Salvar no banco
        const { data, error } = await supabase
            .from('photos')
            .insert({
                user_id: currentUser.id,
                cloudinary_url: fakeCloudinaryUrl,
                category: selectedCategory,
                age: age,
                status: 'pending_approval',
                test_type: selectedType,
                votes_requested: selectedType === 'karma' ? 0 : 20,
                votes_received: 0
            });
            
        if (error) throw error;
        
        messageDiv.innerHTML = '<div class="success">Foto enviada com sucesso!</div>';
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    } catch (error) {
        messageDiv.innerHTML = `<div class="error">Erro: ${error.message}</div>`;
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
});

// Inicializar
checkAuth();
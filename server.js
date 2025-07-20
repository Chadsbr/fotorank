const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/test', (req, res) => {
    res.json({ message: 'FotoRank API funcionando!' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
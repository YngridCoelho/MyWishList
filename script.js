// Funções básicas
function pegarProdutos() {
    const dados = localStorage.getItem('produtos');
    return dados ? JSON.parse(dados) : [];
}

function salvarProdutos(produtos) {
    localStorage.setItem('produtos', JSON.stringify(produtos));
    console.log('Salvou', produtos.length, 'produtos');
}

// Adicionar produto
function adicionarProduto() {
    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const imagem = document.getElementById('imagem').value;
    const loja = document.getElementById('loja').value;
    const prioridade = document.getElementById('prioridade').value;
    
    if (!nome || !preco) {
        alert('Preencha nome e preço');
        return;
    }
    
    const produtos = pegarProdutos();
    produtos.push({
        id: Date.now(),
        nome: nome,
        preco: parseFloat(preco).toFixed(2),
        imagem: imagem || '',
        loja: loja || 'Loja não informada',
        prioridade: prioridade,
        desejado: true,
        comprado: false
    });
    
    salvarProdutos(produtos);
    window.location.href = 'desejados.html';
}

// Excluir produto
function excluirProduto(id) {
    let produtos = pegarProdutos();
    produtos = produtos.filter(p => p.id !== id);
    salvarProdutos(produtos);
    window.location.reload();
}

// Marcar como comprado - VERSÃO SIMPLES
function marcarComprado(id) {
    console.log('Marcando comprado:', id);
    let produtos = pegarProdutos();
    
    // Encontrar e alterar o produto
    for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].id === id) {
            produtos[i].comprado = true;
            produtos[i].desejado = false;
            console.log('Produto alterado:', produtos[i]);
            break;
        }
    }
    
    // Salvar
    salvarProdutos(produtos);
    
    // Verificar se salvou
    const verificar = pegarProdutos();
    const encontrado = verificar.find(p => p.id === id);
    console.log('Verificação:', encontrado);
    
    // Redirecionar para a página correta
    if (encontrado && encontrado.comprado === true) {
        alert('Produto marcado como comprado!');
        window.location.href = 'comprados.html';
    } else {
        alert('Erro ao marcar como comprado');
    }
}

// Mostrar produtos
function mostrarProdutos() {
    const produtos = pegarProdutos();
    const url = window.location.pathname;
    
    console.log('URL:', url);
    console.log('Total produtos:', produtos.length);
    
    let container = null;
    let produtosParaMostrar = [];
    
    if (url.includes('todos.html')) {
        container = document.getElementById('cards');
        produtosParaMostrar = produtos;
        console.log('Mostrando TODOS');
    } 
    else if (url.includes('desejados.html')) {
        container = document.getElementById('cardsDesejados');
        produtosParaMostrar = produtos.filter(p => p.desejado === true);
        console.log('Mostrando DESEJADOS:', produtosParaMostrar.length);
    } 
    else if (url.includes('comprados.html')) {
        container = document.getElementById('cardsComprados');
        produtosParaMostrar = produtos.filter(p => p.comprado === true);
        console.log('Mostrando COMPRADOS:', produtosParaMostrar.length);
    }
    else {
        console.log('Página inicial');
        return;
    }
    
    if (!container) {
        console.error('Container não encontrado');
        return;
    }
    
    if (produtosParaMostrar.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:50px;background:white;">Nenhum produto</div>';
        return;
    }
    
    let html = '<div style="display:flex;flex-wrap:wrap;gap:20px;">';
    
    for (let p of produtosParaMostrar) {
        let cor = p.prioridade === 'Alta' ? '#4B1535' : (p.prioridade === 'Média' ? '#71557A' : '#D183A9');
        
        let img = p.imagem ? 
            `<img src="${p.imagem}" style="width:100%;height:200px;object-fit:cover;" onerror="this.src='https://via.placeholder.com/300x200'">` : 
            `<img src="https://via.placeholder.com/300x200?text=Sem+Imagem" style="width:100%;height:200px;object-fit:cover;">`;
        
        html += `
            <div style="flex:1 1 calc(33% - 20px);min-width:280px;background:white;border-radius:16px;overflow:hidden;">
                ${img}
                <div style="padding:20px;">
                    <h3>${p.nome}</h3>
                    <p>Loja: ${p.loja}</p>
                    <p>Preço: R$ ${p.preco}</p>
                    <p style="display:inline-block;padding:5px 10px;border-radius:8px;color:white;background:${cor}">${p.prioridade}</p>
                    <div style="margin-top:15px;">
                        ${p.comprado === false ? `<button onclick="marcarComprado(${p.id})" style="background:#3A345B;color:white;padding:8px;border:none;border-radius:5px;margin-right:10px;cursor:pointer;">✓ Comprar</button>` : ''}
                        <button onclick="excluirProduto(${p.id})" style="background:#4B1535;color:white;padding:8px;border:none;border-radius:5px;cursor:pointer;">✗ Excluir</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Iniciar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada');
    if (!window.location.pathname.includes('index.html')) {
        mostrarProdutos();
    }
});

// Expor funções
window.adicionarProduto = adicionarProduto;
window.excluirProduto = excluirProduto;
window.marcarComprado = marcarComprado;
function pegarProdutos() {
    const dados = localStorage.getItem('produtos');
    return dados ? JSON.parse(dados) : [];
}

function salvarProdutos(produtos) {
    localStorage.setItem('produtos', JSON.stringify(produtos));
    console.log('Salvou', produtos.length, 'produtos');
}

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

function excluirProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        let produtos = pegarProdutos();
        produtos = produtos.filter(p => p.id !== id);
        salvarProdutos(produtos);
        window.location.reload();
    }
}

function marcarComprado(id) {
    console.log('Marcando comprado:', id);
    let produtos = pegarProdutos();
    
    for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].id === id) {
            produtos[i].comprado = true;
            produtos[i].desejado = false;
            console.log('Produto alterado:', produtos[i]);
            break;
        }
    }
    
    salvarProdutos(produtos);
    
    const verificar = pegarProdutos();
    const encontrado = verificar.find(p => p.id === id);
    console.log('Verificação:', encontrado);
    
    if (encontrado && encontrado.comprado === true) {
        alert('Produto marcado como comprado!');
        window.location.href = 'comprados.html';
    } else {
        alert('Erro ao marcar como comprado');
    }
}

function editarProduto(id) {
    const produtos = pegarProdutos();
    const produto = produtos.find(p => p.id === id);
    
    if (produto) {
        document.getElementById('editId').value = produto.id;
        document.getElementById('editNome').value = produto.nome;
        document.getElementById('editPreco').value = produto.preco;
        document.getElementById('editImagem').value = produto.imagem || '';
        document.getElementById('editLoja').value = produto.loja;
        document.getElementById('editPrioridade').value = produto.prioridade;
        
        document.getElementById('editModal').style.display = 'block';
    }
}

function salvarEdicao() {
    const id = parseInt(document.getElementById('editId').value);
    const nome = document.getElementById('editNome').value;
    const preco = document.getElementById('editPreco').value;
    const imagem = document.getElementById('editImagem').value;
    const loja = document.getElementById('editLoja').value;
    const prioridade = document.getElementById('editPrioridade').value;
    
    if (!nome || !preco) {
        alert('Preencha nome e preço');
        return;
    }
    
    let produtos = pegarProdutos();
    const index = produtos.findIndex(p => p.id === id);
    
    if (index !== -1) {
        produtos[index] = {
            ...produtos[index],
            nome: nome,
            preco: parseFloat(preco).toFixed(2),
            imagem: imagem || '',
            loja: loja,
            prioridade: prioridade
        };
        
        salvarProdutos(produtos);
        fecharModal();
        window.location.reload();
    }
}

function fecharModal() {
    document.getElementById('editModal').style.display = 'none';
}

function mostrarProdutos() {
    const produtos = pegarProdutos();
    
    const containerTodos = document.getElementById('cards');
    const containerDesejados = document.getElementById('cardsDesejados');
    const containerComprados = document.getElementById('cardsComprados');
    
    let container = null;
    let produtosParaMostrar = [];
    
    if (containerTodos) {
        container = containerTodos;
        produtosParaMostrar = produtos;
        console.log('Mostrando TODOS');
    } 
    else if (containerDesejados) {
        container = containerDesejados;
        produtosParaMostrar = produtos.filter(p => p.desejado === true);
        console.log('Mostrando DESEJADOS');
    } 
    else if (containerComprados) {
        container = containerComprados;
        produtosParaMostrar = produtos.filter(p => p.comprado === true);
        console.log('Mostrando COMPRADOS');
    }
    else {
        console.log('Página inicial - nenhum container de listagem encontrado.');
        return;
    }
    
    if (produtosParaMostrar.length === 0) {
        container.innerHTML = '<div class="sem-produtos"><p>Nenhum produto encontrado</p></div>';
        return;
    }
    
    let html = '<div style="display:flex;flex-wrap:wrap;gap:20px;">';
    
    for (let p of produtosParaMostrar) {
        let cor = p.prioridade === 'Alta' ? '#4B1535' : (p.prioridade === 'Média' ? '#71557A' : '#D183A9');
        
        let img = p.imagem ? 
        `<img src="${p.imagem}" style="width:100%;height:200px;object-fit:cover;" onerror="this.src='https://via.placeholder.com/300x200?text=Sem+Imagem'">` : 
        `<img src="https://via.placeholder.com/300x200?text=Sem+Imagem" style="width:100%;height:200px;object-fit:cover;">`;
        
        let compradoClass = p.comprado === true ? 'comprado' : '';
        
        html += `
            <div style="flex:1 1 calc(33% - 20px);min-width:280px;background:white;border-radius:16px;overflow:hidden;" class="${compradoClass}">
                ${img}
                <div style="padding:20px;">
                    <h3>${p.nome}</h3>
                    <p>Loja: ${p.loja}</p>
                    <p>Preço: R$ ${p.preco}</p>
                    <p style="display:inline-block;padding:5px 10px;border-radius:8px;color:white;background:${cor}">${p.prioridade}</p>
                    <div style="margin-top:10px;">
                        <button onclick="editarProduto(${p.id})" class="btn-editar">Editar</button>
                        ${p.comprado === false ? `<button onclick="marcarComprado(${p.id})" class="btn-comprado">Comprar</button>` : ''}
                        <button onclick="excluirProduto(${p.id})" class="btn-excluir">Excluir</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada');
    mostrarProdutos();

    window.onclick = function(event) {
        const modal = document.getElementById('editModal');
        if (event.target === modal) {
            fecharModal();
        }
    }
});

window.adicionarProduto = adicionarProduto;
window.excluirProduto = excluirProduto;
window.marcarComprado = marcarComprado;
window.editarProduto = editarProduto;
window.salvarEdicao = salvarEdicao;
window.fecharModal = fecharModal;
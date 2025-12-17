import React, { useEffect, useState } from "react";
import api from "../../services/api";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Necessário para selecionar o vendedor
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [idVendedor, setIdVendedor] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  // 1. Carregar Dados (Produtos e Utilizadores para o Select)
  const carregarDados = async () => {
    try {
      const [resProdutos, resUsuarios] = await Promise.all([
        api.get("/produtos"),
        api.get("/usuarios"),
      ]);
      setProdutos(resProdutos.data);
      setUsuarios(resUsuarios.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // 2. Criar ou Atualizar Produto
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dadosProduto = {
      nome,
      preco: parseFloat(preco),
      estoque: parseInt(estoque),
      id_usuario_vendedor: idVendedor,
    };

    try {
      if (editandoId) {
        await api.put(`/produtos/${editandoId}`, dadosProduto);
        alert("Produto atualizado!");
      } else {
        await api.post("/produtos", dadosProduto); // Verifique se a rota no routes.js é /produtos ou /produtoss
        alert("Produto cadastrado!");
      }
      limparFormulario();
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.error || "Erro na operação");
    }
  };

  // 3. Eliminar Produto
  const handleDeletar = async (id) => {
    if (window.confirm("Deseja remover este produto?")) {
      try {
        await api.delete(`/produtos/${id}`);
        carregarDados();
      } catch (error) {
        alert(error.response?.data?.error || "Erro ao eliminar");
      }
    }
  };

  const prepararEdicao = (prod) => {
    setEditandoId(prod.id);
    setNome(prod.nome);
    setPreco(prod.preco);
    setEstoque(prod.estoque);
    setIdVendedor(prod.id_usuario_vendedor);
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setNome("");
    setPreco("");
    setEstoque("");
    setIdVendedor("");
  };

  return (
    <div>
      <h2>Gestão de Produtos</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nome do Produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Estoque"
          value={estoque}
          onChange={(e) => setEstoque(e.target.value)}
          required
        />

        <select
          value={idVendedor}
          onChange={(e) => setIdVendedor(e.target.value)}
          required
          disabled={editandoId}
        >
          <option value="">Selecione o Vendedor</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome}
            </option>
          ))}
        </select>

        <button type="submit">{editandoId ? "Atualizar" : "Anunciar"}</button>
        {editandoId && (
          <button onClick={limparFormulario} type="button">
            Cancelar
          </button>
        )}
      </form>

      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Preço</th>
            <th>Stock</th>
            <th>Vendedor (ID)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nome}</td>
              <td>€ {p.preco.toFixed(2)}</td>
              <td>{p.estoque}</td>
              <td>{p.id_usuario_vendedor}</td>
              <td>
                <button onClick={() => prepararEdicao(p)}>Editar</button>
                <button onClick={() => handleDeletar(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Produtos;

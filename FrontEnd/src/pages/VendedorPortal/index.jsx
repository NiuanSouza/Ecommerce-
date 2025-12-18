import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

function VendedorPortal() {
  const [produtosVendedor, setProdutosVendedor] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [idVendedorLogado, setIdVendedorLogado] = useState("");
  const [busca, setBusca] = useState("");
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    preco: "",
    estoque: "",
  });

  const carregarProdutosDoVendedor = useCallback(async (vendedorId) => {
    if (!vendedorId) return;
    try {
      const res = await api.get(`/produtos?id_usuario_vendedor=${vendedorId}`);
      setProdutosVendedor(res.data);
    } catch {
      console.error("Erro ao carregar produtos do vendedor");
    }
  }, []);

  useEffect(() => {
    api.get("/usuarios").then((res) => setUsuarios(res.data));
  }, []);

  const handleUserChange = (e) => {
    const id = e.target.value;
    setIdVendedorLogado(id);
    carregarProdutosDoVendedor(id);
  };

  const handleCadastrarProduto = async (e) => {
    e.preventDefault();
    if (!idVendedorLogado) return alert("Selecione um vendedor primeiro!");

    try {
      await api.post("/produtos", {
        nome: novoProduto.nome,
        preco: parseFloat(novoProduto.preco),
        estoque: parseInt(novoProduto.estoque),
        id_usuario_vendedor: parseInt(idVendedorLogado),
      });

      alert("Produto cadastrado com sucesso!");
      setNovoProduto({ nome: "", preco: "", estoque: "" });

      carregarProdutosDoVendedor(idVendedorLogado);
    } catch {
      alert("Erro ao cadastrar produto.");
    }
  };

  const produtosFiltrados = produtosVendedor.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="vendedor-portal">
      <div
        className="cliente-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>Painel do Vendedor</h2>
        <select value={idVendedorLogado} onChange={handleUserChange}>
          <option value="">Entrar como Vendedor (Simular Login)</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome}
            </option>
          ))}
        </select>
      </div>

      {idVendedorLogado && (
        <>
          <section
            className="portal-card"
            style={{
              background: "#f9f9f9",
              padding: "20px",
              marginBottom: "30px",
            }}
          >
            <h3>📦 Anunciar Novo Produto</h3>
            <form
              onSubmit={handleCadastrarProduto}
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
                flexWrap: "wrap",
              }}
            >
              <input
                placeholder="Nome do Produto"
                value={novoProduto.nome}
                onChange={(e) =>
                  setNovoProduto({ ...novoProduto, nome: e.target.value })
                }
                required
                style={{ flex: 2 }}
              />
              <input
                type="number"
                placeholder="Preço R$"
                value={novoProduto.preco}
                onChange={(e) =>
                  setNovoProduto({ ...novoProduto, preco: e.target.value })
                }
                required
                style={{ flex: 1 }}
              />
              <input
                type="number"
                placeholder="Estoque"
                value={novoProduto.estoque}
                onChange={(e) =>
                  setNovoProduto({ ...novoProduto, estoque: e.target.value })
                }
                required
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-edit" style={{ flex: 1 }}>
                Anunciar
              </button>
            </form>
          </section>

          <section className="vitrine">
            <h3>Meus Produtos Anunciados</h3>
            <input
              placeholder="Pesquisar entre meus anúncios..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
            />

            <div className="card-grid">
              {produtosFiltrados.length > 0 ? (
                produtosFiltrados.map((p) => (
                  <div key={p.id} className="portal-card">
                    <h4>{p.nome}</h4>
                    <p
                      className="price"
                      style={{ color: "var(--secondary)", fontWeight: "bold" }}
                    >
                      R$ {Number(p.preco).toFixed(2)}
                    </p>
                    <p>
                      <small>Em estoque: {p.estoque} unidades</small>
                    </p>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    gridColumn: "1 / -1",
                    padding: "20px",
                  }}
                >
                  Você ainda não possui produtos cadastrados.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default VendedorPortal;

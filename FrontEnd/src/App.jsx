import React, { useState } from "react";
import Usuarios from "./pages/Usuarios";
import Produtos from "./pages/Produtos";
import Compras from "./pages/Compras";

function App() {
  const [pagina, setPagina] = useState("usuarios");

  return (
    <div>
      <nav
        style={{ padding: "10px", background: "#eee", marginBottom: "20px" }}
      >
        <button onClick={() => setPagina("usuarios")}>Usuários</button>
        <button onClick={() => setPagina("produtos")}>Produtos</button>
        <button onClick={() => setPagina("compras")}>Compras</button>
      </nav>

      <main>
        {pagina === "usuarios" && <Usuarios />}
        {pagina === "produtos" && <Produtos />}
        {pagina === "compras" && <Compras />}
      </main>
    </div>
  );
}

export default App;

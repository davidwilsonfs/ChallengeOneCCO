import "./App.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { Button } from "@mui/material";


//################################# START Firebase Settings ####################################
//quando depois eu explico para vocês como configura o firebase, por hora podem usar o meu
const firebaseConfig = {
  apiKey:
    "AAAAplipsUI:APA91bGQbCDPCuHA-XQRVNJRvYysIqzPqJ4JXk4d9iowYwHgCel81VZCQYqgdqEQaVX2qGWmwyLjGrnkpKtAs56LhlFZaCdRHZMpn9XVLcxtEc7c5GeiD-uMuibIkDFAQVpfV7mtFduP",
  authDomain: "summerjob-9c9bf.firebaseapp.com",
  databaseURL: "https://summerjob-9c9bf-default-rtdb.firebaseio.com/",
};
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);
//################################# END Firebase Settings ####################################


//################################# APP ####################################
function App() {
  const [rows, setRows] = useState([]);

  // função apenas para manipular a lista de dados que vem do firebase
  // transforma um objeto em um array
  function createData(response) {
    if (response) {
      const mapped = Object.entries(response).map(([key, val]) => ({
        ...val,
        key,
      }));

      setRows(mapped);
    } else {
      setRows([]);
    }
  }

  // Para entender um pouco mais como funciona o useEffect
  // https://pt-br.reactjs.org/docs/hooks-effect.html
  useEffect(() => {

    const reference = ref(database, "ativos");
    // se inscreve nos eventos do path "ativos", ou seja, qualquer alteração
    // que ocorrer em "ativos" esse trecho do codigo irá receber os dados atualizados
    onValue(reference, (snapshot) => {
      const data = snapshot.val();

      createData(data);
    });

    return () => {};
  }, []);

  return (
    <div className="App">
      {/* Componentes do UI material https://mui.com/pt/components/tables/#dense-table */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Ativo</TableCell>
              <TableCell align="right">Tombamento</TableCell>
              <TableCell align="right">Unidade</TableCell>
              <TableCell align="right">Setor</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.key}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.ativo}
                </TableCell>
                <TableCell align="right">{row.tombamento}</TableCell>
                <TableCell align="right">{row.unidade}</TableCell>
                <TableCell align="right">{row.setor}</TableCell>
                <TableCell align="right">
                  <Button>view</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;

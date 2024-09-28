import express, {Request, Response} from "express"; // usado para criar a aplicação express
import mysql from "mysql2/promise";

const app = express();

// Configura EJS como a engine de renderização de templates
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

// Middleware para servir arquivos estáticos
app.use(express.static('src/views'));

const connection = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mudar123",
    database: "unicesumar"
});
// ------ Rota para a URL raiz ----------
app.get('/', (req: Request, res: Response) => {
    res.redirect('/login');  // ou renderize outra página
});

// Middleware para permitir dados no formato JSON
app.use(express.json());

// Middleware para permitir dados no formato URL ENCODED
app.use(express.urlencoded({ extended: true }));

//--------------Rota Login-------------
app.get('/login', async function (req: Request, res:Response) {
    return res.render('login/login');
})

app.post('/login', async function (req: Request, res: Response)  {
    console.log(req.body);
    const { usuario, senha } = req.body; // Extraia usuário e senha do corpo da requisição !!!!!!!!!!!!!
    const query = "SELECT * FROM users WHERE usuario = ? AND senha = ?";
    const [rows]: any = await connection.query(query, [usuario, senha]);
    if (rows.length > 0) {
        // Login bem-sucedido
        res.redirect('/categories/pginicial'); // Redirecionar para a página de pginicial
    } else {
    
        return res.render('login/login');
     
    }
})

//--------------Rota cadastro-------------
app.get('/cadastro/', async function (req: Request, res:Response) {
    return res.render('login/cadastro');
})
app.post('/cadastro/save', async (req: Request, res: Response) => {
    try { // para ver se esta cessando o banco de dados 
        console.log(req.body); // para ver se esta pegando as info
        const { usuario, Email, nome, senha, papel} = req.body;
        const insertQuery = "INSERT INTO users (usuario, Email, nome, senha, papel) VALUES (?, ?, ?, ?, ?)";
        await connection.query(insertQuery, [usuario, Email, nome, senha, papel]);
        res.redirect("/login");
    } catch (error) {
        console.error('Error inserting data: ', error);
        res.status(500).send('Internal Server Error');
    }
});
//--------------Rota forms-------------
app.get("/categories/form", async function (req: Request, res: Response) {
    return res.render("categories/form");
});
//--------------Rota pqinicial-------------
app.get('/categories/pginicial', async (req: Request, res: Response) => {
    res.render('categories/pginicial');
});

app.get('/categories', async function (req: Request, res: Response) {
    const [rows] = await connection.query("SELECT * FROM categories");
    return res.render('categories/index', {
        categories: rows
    });
});

app.post("/categories/save", async function(req: Request, res: Response) {
    const body = req.body;
    const insertQuery = "INSERT INTO categories (name,descricao) VALUES (?,?)";
    await connection.query(insertQuery, [body.name,body.descricao]);
    res.redirect("/categories");
});

app.post("/categories/delete/:id", async function (req: Request, res: Response) {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM categories WHERE id = ?";
    await connection.query(sqlDelete, [id]);
    res.redirect("/categories");
});
 
//------------ localHost ---------
app.listen('3000', () => console.log("Server is listening on port 3000"));
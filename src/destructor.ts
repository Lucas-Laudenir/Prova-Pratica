const usuario = {
    nome: "rafael",
    idade: 34
};
const nomes = ["rafael","joao"];
const{idade,nome} = usuario; // destrutor de objeto
const [rafael] = nomes; // destrutor de array
console.log(nome,idade);
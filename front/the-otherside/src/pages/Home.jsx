function Home() {

const user = localStorage.getItem("user");
    
    return (  
        <h1>Bienvenido al culto {user}</h1>
    );
}

export default Home;
import { useEffect, useState } from "react";
import styled from "styled-components";
import "../styles/styles.css";
import VisualizarNoticia from "./visualizarNoticia";

//Imagenes
import cargandoImg from "../images/cargando.gif";


const ListaContenedor = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    padding: 2.5vw;
    padding-bottom: 15vw;

    & h2 {
        font-weight: 600;
        margin: 4vw 0;
        text-align: center;
    }
`;

const CargandoContenedor = styled.div`
    width: 10vw;
    margin: 3vw auto;
    & img {
        width: 100%;
        height: 100%;
    }

    @media screen and (min-width: 750px) {
        width: 3vw;
    }
`;

const Noticias = styled.div`
    display: grid;
    justify-items: center;
    grid-template-columns: auto;

    @media screen and (min-width:750px) {
        grid-template-columns: auto auto;
    }
    
    @media screen and (min-width:1366px) {
        grid-template-columns: auto auto auto;
    }
`;

const Noticia = styled.div`
    cursor: pointer;
    width: 95%;
    display: flex;
    background-color: #F0F0F0;
    padding: 1vw;
    border-radius: 2vw;
    margin-bottom: 4vw;
    font-size: 3vw;
    align-items: center;

    & img{
        height: 20vw;
        width: 20vw;
    }
    & div {
        padding: 0;
        padding-left: 2vw;
    }
    & h3 {
        width: 100%;
    }

    & span {
        font-size: 2.5vw;
        margin-left: auto;
        margin-top: 10px;
    }
    & b {
        font-weight: 500;
        color:#443939;
    }
    & div div {
        display: flex;
        width: 100%;
    }
    & i {
        text-decoration: underline;
    }

    @media screen and (min-width:750px){
        border-radius: 0.5vw;
        margin-bottom: 2vw;
        font-size: 15px;

        & img {
            height: 10vw;
            width: 10vw;
        }

        & span {
            font-size:15px
        }
    }
    @media screen and (min-width: 2000px){  
        font-size: 20px;
    }
`;

export function convertirAfecha (txt){
    const fecha = new Date(txt);
    
    return fecha.getDate()+"/"+fecha.getMonth()+"/"+fecha.getFullYear();
}


export default function NoticiasComponent(){

    let [noticias, setNoticias] = useState([]);
    let [cargandoNoticias, setCargandoNoticias] = useState(false);
    let [pagina, setPagina ] = useState(1);
    let [listaVacia, setListaVacia] = useState(false);
    let [verNoticia, setVerNoticia] = useState([false, false]);

    async function getNoticiasDesarrolloWeb(){
        if (!cargandoNoticias && !listaVacia) {
            setCargandoNoticias(true);
            await fetch("https://hn.algolia.com/api/v1/search_by_date?query=dev&hitsPerPage=50&page="+pagina, {
                method:"GET"
            })
            .then((res)=>{
                if (res.ok) {
                    return res.json();
                }
            })
            .then((newNoticiasDatos)=>{
                if (newNoticiasDatos.hits.length > 0) {
                    if (pagina > 1){
                        const newNoticias = noticias;
                        newNoticiasDatos.hits.map((noticia)=>{
                            if (noticia.story_title !== null || noticia.title !== null) {
                                newNoticias.push(noticia);
                            }
                        });
                        setNoticias(newNoticias);
                    } else {
                        const newNoticias = [];
                        newNoticiasDatos.hits.map((noticia)=>{
                            let diferente = true;
                            
                            newNoticias.map((oldNoticia)=>{
                                if (noticia.title) {
                                    if (oldNoticia.title == noticia.title) {
                                        diferente = false;
                                    }
                                }
                                if (noticia.story_title) {
                                    if (oldNoticia.story_title == noticia.story_title) {
                                        diferente = false;
                                    }
                                }
                            })
                            if (noticia.story_title !== null || noticia.title !== null) {
                                if (diferente) {
                                    newNoticias.push(noticia);
                                }
                            }
                        });
                        setNoticias(newNoticias);
                    }
                    
                    setPagina(pagina+1);
                } else {
                    setListaVacia(true);
                }
            })
            .catch(()=>{
                alert("Sucedio un error al obtener los datos.");
            })
            setCargandoNoticias(false);
        }
    }

    function recortarTexto (texto){
        let result = "";

        const arrayText = texto.split("");
        arrayText.map((letra)=>{
            if (result.length < 51) {
                result = result+letra;
            }
        });
        return result;
    }

    useEffect(()=>{
        getNoticiasDesarrolloWeb(1);
    },[]);

    useEffect(()=>{
        window.onscroll = ()=>{
            const y = document.body.offsetHeight;
            const scrollY = parseInt(window.scrollY+window.innerHeight)*100/y;
            if (scrollY > 99) {
                if (!listaVacia) {
                    setCargandoNoticias(true);
                    getNoticiasDesarrolloWeb();
                }
            }
        }
    })

    return (
        <ListaContenedor style={{overflowY:verNoticia[0] ? "hidden" : "scroll"}}>
            <h2>Noticias sobre Desarrollo Web y Software</h2>
            <Noticias>
                { noticias !== undefined &&
                    noticias.map((noticia, index)=>(
                        <Noticia onClick={()=>setVerNoticia([noticia, index])} key={index}>
                            <img src={`https://picsum.photos/id/${index}/500/500`} />
                            <div>
                                <h3>{noticia.title || noticia.story_title}</h3>
                                <p style={{marginBottom:"3px"}}>Por <b>{noticia.author}</b></p>
                                <p dangerouslySetInnerHTML={{__html: noticia._highlightResult.comment_text ? noticia._highlightResult.comment_text.value ? recortarTexto(noticia._highlightResult.comment_text.value)+"..."+"<i>Leer más</i>" : "Sin"  : "Sin descripción"}}/>
                                <div>
                                    <span>Creado {convertirAfecha(noticia.created_at)}</span>
                                </div>
                            </div>
                        </Noticia>
                    ))
                }
            </Noticias>
            { cargandoNoticias === true &&
                <CargandoContenedor><img src={cargandoImg} /></CargandoContenedor>
            }
            { verNoticia[0] &&
                <VisualizarNoticia datos={verNoticia} close={()=>setVerNoticia(false)} />
            }
        </ListaContenedor>
    );
};
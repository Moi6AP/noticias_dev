import { useEffect } from "react";
import styled from "styled-components";

// imagenes
import devolver from "../images/devolver.png";
import { convertirAfecha } from "./noticias";

const Noticia = styled.div`
    display: flex;
    position: fixed;
    flex-direction: column;
    padding: 5px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #F0F0F0;
    z-index: 100;
    align-items: center;
    overflow-y: auto;
    font-size: 4vw;

    & i {
        font-weight: 700;
    }

    & h2 {
        text-align: left;
        width: 90%;
        margin: 5px 0;
    }

    & p{
        width: 90%;
        text-align: left;
        color: #353535;
        font-weight: 500;
    }
    & span {
        margin-right: auto;
        margin-left: 5%;
        margin-bottom: 15px;
    }
    & i {
        margin: auto 5% 5% auto;
    }

    & a {
        display: none;
    }

    @media screen and (min-width: 820px) {
        font-size: 15px;

        & i {
            margin: auto 3% 9px auto;
        }
    }
`;

const Img = styled.div`
    width: 90%;
    height: 30%;
    background-image: url(${e => `https://picsum.photos/id/${e.index}/200/300`});
    background-repeat: repeat;
    background-size: contain;

    @media screen and (min-width: 820px) {
        width: 60%;
        height: 60%;
        margin-bottom: 15px;
    }
`;

const BtnDevolver = styled.img`
    margin: 3vw;
    margin-right: auto;
    width: 10vw;
    height: 10vw;
    cursor: pointer;

    @media screen and (min-width: 820px) {
        width: 4vw;
        height: 4vw;
        margin: 0;
        margin-right: auto;
    }
`;

export default function VisualizarNoticia({datos, close}){

    return (
        <Noticia>
            <BtnDevolver src={devolver} onClick={()=>close()}/>
            <Img index={datos[1]} />
            <h2>{datos[0].title || datos[0].story_title}</h2>
            <span>Por <b>{datos[0].author}</b></span>
            <p dangerouslySetInnerHTML={{__html:datos[0]._highlightResult.comment_text ? datos[0]._highlightResult.comment_text.value ? datos[0]._highlightResult.comment_text.value : "Sin"  : "Sin descripción"}}/>
            <i>Creado {convertirAfecha(datos[0].created_at)}</i>
        </Noticia>
    )
}
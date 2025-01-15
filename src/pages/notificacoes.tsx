import Layout from "@/components/template/Layout";
import useAppData from "@/data/hook/useAppData";

export default function Notificacao() {
    const ctx = useAppData();

    return (
        <div>
            <Layout
                titulo="Notificações"
                subtitulo="subtitulo pagina Notificações"
            >
                <button onClick={ctx.alternarTema}>dwaadwaw</button>
            </Layout>
        </div>
    );
}

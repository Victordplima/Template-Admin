import { createContext, useState, useEffect } from "react";
import {
    signInWithPopup,
    GoogleAuthProvider,
    getAuth,
    onAuthStateChanged,
    User,
} from "firebase/auth";
import { useRouter } from "next/router";
import Usuario from "@/model/Usuario";
import { auth } from "../../firebase/config";

interface AuthContextProps {
    usuario?: Usuario;
    loginGoogle?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({});

async function usuarioNormalizado(usuarioFirebase: User): Promise<Usuario> {
    const token = await usuarioFirebase.getIdToken();
    return {
        uid: usuarioFirebase.uid,
        nome: usuarioFirebase.displayName ?? "",
        email: usuarioFirebase.email ?? "",
        token,
        provedor: usuarioFirebase.providerData[0]?.providerId ?? "",
        imagemUrl: usuarioFirebase.photoURL ?? "",
    };
}

export function AuthProvider(props: React.PropsWithChildren<{}>) {
    const router = useRouter();
    const [usuario, setUsuario] = useState<Usuario | undefined>(undefined);

    async function configurarSessao(usuarioFirebase: User | null) {
        if (usuarioFirebase) {
            const usuario = await usuarioNormalizado(usuarioFirebase);
            setUsuario(usuario);
        } else {
            setUsuario(undefined);
        }
    }

    async function loginGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const resultado = await signInWithPopup(auth, provider);
            await configurarSessao(resultado.user);
            router.push("/");
        } catch (error) {
            console.error("Erro ao fazer login com Google:", error);
        }
    }

    useEffect(() => {
        const cancelarObservador = onAuthStateChanged(auth, configurarSessao);
        return () => cancelarObservador();
    }, []);

    return (
        <AuthContext.Provider value={{ usuario, loginGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;

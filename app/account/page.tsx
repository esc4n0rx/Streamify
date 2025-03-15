"use client";

import { useState, useEffect, FormEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AvatarModal } from "@/components/AvatarModal";

const baseUrl = "https://api.streamhivex.icu";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ nome: string; email: string; url_avatar: string } | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Carrega os dados do usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setNome(parsed.nome);
      setEmail(parsed.email);
      setSelectedAvatar(parsed.url_avatar);
    }
  }, []);

  // Gera a URL completa para o avatar (caso venha um caminho relativo)
  const getAvatarUrl = (path: string) => {
    return path.startsWith("https") ? path : `${baseUrl}/${path.replace(/^\//, "")}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Constrói o payload apenas com os campos que foram alterados
    const payload: Record<string, string> = {};
    if (user) {
      if (nome && nome !== user.nome) payload.nome = nome;
      if (email && email !== user.email) payload.email = email;
      if (selectedAvatar && selectedAvatar !== user.url_avatar) payload.url_avatar = selectedAvatar;
    }
    if (newPassword) payload.senha = newPassword;

    // Se nada foi alterado, avisa o usuário
    if (Object.keys(payload).length === 0) {
      toast("Nenhuma alteração foi feita");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Erro ao atualizar perfil");
        setLoading(false);
        return;
      }
      toast.success("Perfil atualizado com sucesso!");

      // Atualiza os dados do usuário armazenados localmente
      if (!user) throw new Error("User is null");
      const updatedUser = { 
        ...user, 
        ...payload, 
        nome: payload.nome || user.nome, 
        email: payload.email || user.email, 
        url_avatar: payload.url_avatar || user.url_avatar 
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setNewPassword("");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro na conexão com o servidor.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {isAvatarModalOpen && (
        <AvatarModal
          onSelect={(avatarPath) => {
            setSelectedAvatar(avatarPath);
            setIsAvatarModalOpen(false);
          }}
          onClose={() => setIsAvatarModalOpen(false)}
        />
      )}
      {/* Botão para voltar para o Dashboard */}
      <div className="max-w-3xl mx-auto mb-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="text-blue-400 hover:underline"
        >
          &larr; Voltar para Dashboard
        </button>
      </div>
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Gerenciar Conta</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-black/50 p-6 rounded-xl shadow-md space-y-6"
      >
        {/* Dados Pessoais */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Dados Pessoais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Alterar Avatar */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Avatar</h2>
          <div className="flex items-center gap-4">
            {selectedAvatar && (
              <img
                src={getAvatarUrl(selectedAvatar)}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
              />
            )}
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="text-blue-400 hover:underline"
            >
              Alterar Avatar
            </button>
          </div>
        </div>

        {/* Alterar Senha */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Alterar Senha</h2>
          <input
            type="password"
            placeholder="Digite a nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-4 rounded bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}

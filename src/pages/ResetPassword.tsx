import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { passwordRecoveryService } from "@/services/passwordRecovery";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false);
        return;
      }
      try {
        const isValid = await passwordRecoveryService.verifyResetToken(token);
        setIsValidToken(isValid);
      } catch {
        setIsValidToken(false);
      }
    };
    verifyToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setError("Token inválido");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await passwordRecoveryService.resetPassword({
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setSuccess(true);
      toast.success("Senha redefinida com sucesso!");
    } catch (err: any) {
      setError(err.message || "Erro ao redefinir senha");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === null) {
    return <p>Verificando token...</p>;
  }

  if (!isValidToken) {
    return (
      <div>
        <h1>Token Inválido</h1>
        <p>
          O link de recuperação é inválido ou expirou. Solicite um novo link de
          recuperação.
        </p>
        <button onClick={() => navigate("/forgot-password")}>
          Solicitar Novo Link
        </button>
        <button onClick={() => navigate("/login")}>Voltar ao Login</button>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <h1>Senha Redefinida!</h1>
        <p>
          Sua senha foi redefinida com sucesso. Agora você pode fazer login com
          sua nova senha.
        </p>
        <button onClick={() => navigate("/login")}>Ir para Login</button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redefinir Senha</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p style={{ color: "red" }}>{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Redefinindo..." : "Redefinir Senha"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetPassword;

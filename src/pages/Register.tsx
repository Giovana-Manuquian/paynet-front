import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Shield,
  MapPin,
  User,
  Mail,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchAddressByCEP,
  formatCEP,
  validateCEP,
  CEPError,
} from "@/services/cep";
import { toast } from "sonner";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
    cep: z.string().min(8, "CEP deve ter 8 dígitos"),
    street: z.string().min(1, "Rua é obrigatória"),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    number: z.string().min(1, "Número é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(2, "Estado é obrigatório"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [error, setError] = useState<string>("");
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const cepValue = watch("cep");

  const handleCEPBlur = async () => {
    if (!cepValue || !validateCEP(cepValue)) return;

    setIsLoadingCEP(true);
    try {
      const addressData = await fetchAddressByCEP(cepValue);
      setValue("street", addressData.street);
      setValue("neighborhood", addressData.neighborhood);
      setValue("city", addressData.city);
      setValue("state", addressData.state);
      setValue("cep", addressData.cep);
      toast.success("Endereço encontrado!");
    } catch (error) {
      if (error instanceof CEPError) {
        toast.error(error.message);
      }
    } finally {
      setIsLoadingCEP(false);
    }
  };

  const onSubmit = async (data: RegisterForm) => {
    setError("");
    try {
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        address: {
          street: data.street,
          neighborhood: data.neighborhood,
          number: data.number,
          city: data.city,
          state: data.state,
          cep: data.cep,
        },
      });
      toast.success("Conta criada com sucesso!");
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
    }
  };

  return (
    <div className="auth-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 paynet-gradient rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Criar Conta</h1>
            <p className="text-muted-foreground mt-2">
              Preencha seus dados para começar
            </p>
          </div>

          <Card className="auth-card">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl text-center">Cadastro</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 border-destructive/20 bg-destructive/5">
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Informações Pessoais
                  </div>

                  <div>
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      className="mt-1"
                      placeholder="Seu nome completo"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="mt-1"
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-4">
                  <div className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                    <Lock className="w-4 h-4 mr-2" />
                    Senha
                  </div>

                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      className="mt-1"
                      placeholder="Mínimo 6 caracteres"
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword")}
                      className="mt-1"
                      placeholder="Digite a senha novamente"
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <div className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    Endereço
                  </div>

                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <div className="relative">
                      <Input
                        id="cep"
                        {...register("cep")}
                        onBlur={handleCEPBlur}
                        onChange={(e) => {
                          const formatted = formatCEP(e.target.value);
                          setValue("cep", formatted);
                        }}
                        className="mt-1"
                        placeholder="00000-000"
                        maxLength={9}
                      />
                      {isLoadingCEP && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    {errors.cep && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.cep.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        {...register("street")}
                        className="mt-1"
                        placeholder="Nome da rua"
                      />
                      {errors.street && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.street.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        {...register("number")}
                        className="mt-1"
                        placeholder="123"
                      />
                      {errors.number && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.number.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      {...register("neighborhood")}
                      className="mt-1"
                      placeholder="Nome do bairro"
                    />
                    {errors.neighborhood && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.neighborhood.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        {...register("city")}
                        className="mt-1"
                        placeholder="Nome da cidade"
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        {...register("state")}
                        className="mt-1"
                        placeholder="SP"
                        maxLength={2}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    "Criar Conta"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Entrar
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;

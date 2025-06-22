import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usersService, UserProfile, UsersListResponse } from "@/services/users";
import { toast } from "sonner";
import {
  Shield,
  LogOut,
  User,
  Calendar,
  Mail,
  MapPin,
  CheckCircle,
  Clock,
  CreditCard,
  Search,
  Users,
  Loader2,
  RefreshCw,
} from "lucide-react";

const Home: React.FC = () => {
  const { user, logout } = useAuth();

  // Estados para a lista de usuários
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Função para carregar usuários
  const loadUsers = async () => {
    try {
      setError("");
      const response = await usersService.getAllUsers(1, 50);
      setUsers(response.users ?? []); // Protege contra undefined
      // console.log("loadUsers response:", response.users);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar usuários");
      toast.error("Erro ao carregar lista de usuários");
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar a lista
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
    toast.success("Lista atualizada!");
  };

  // Função para buscar usuários
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadUsers();
      return;
    }
    try {
      setLoading(true);
      const searchResults: UsersListResponse =
        await usersService.searchUsers(searchQuery);
      setUsers(searchResults.users ?? []); // Protege contra undefined
      // console.log("searchResults response:", searchResults.users);
    } catch (err: any) {
      toast.error("Erro ao buscar usuários");
    } finally {
      setLoading(false);
    }
  };

  // Carregar usuários ao montar o componente
  useEffect(() => {
    loadUsers();

    (async () => {
      try {
        const response = await usersService.getAllUsers(1, 50);
        console.log("Teste direto getAllUsers:", response);
      } catch (e) {
        console.error("Erro no teste direto getAllUsers:", e);
      }
    })();
  }, []);

  // Filtro local adicional
  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 paynet-gradient rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  PayAuth
                </h1>
                <p className="text-sm text-muted-foreground">
                  Plataforma de Pagamentos
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {user?.fullName}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.fullName ? getInitials(user.fullName) : "U"}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Bem-vindo, {user?.fullName?.split(" ")[0]}! 👋
            </h2>
            <p className="text-muted-foreground">
              Gerencie usuários e acompanhe o sistema de autenticação.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 justify-center">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total de Usuários
                    </p>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-primary mr-2" />
                      <span className="text-2xl font-bold text-foreground">
                        {users.length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Status da Conta
                    </p>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-accent mr-2" />
                      <span className="font-semibold text-foreground">
                        Ativa
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-accent/10 text-accent"
                  >
                    Verificada
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Último Login
                    </p>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="font-semibold text-foreground">
                        Agora
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users List Section - NOVA FUNCIONALIDADE */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Usuários Cadastrados
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 border-destructive/20 bg-destructive/5">
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Search */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome ou e-mail..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  Buscar
                </Button>
              </div>

              {/* Users Grid */}
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">
                    Carregando usuários...
                  </p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Nenhum usuário encontrado"
                      : "Nenhum usuário cadastrado"}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map((userItem) => (
                    <Card
                      key={userItem.id}
                      className="border border-slate-200/60"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(userItem.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">
                              {userItem.fullName}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {userItem.email}
                            </p>
                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(userItem.createdAt)}
                            </div>
                            {userItem.address && (
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3 mr-1" />
                                {userItem.address.city},{" "}
                                {userItem.address.state}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;

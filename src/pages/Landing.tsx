import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CreditCard, Zap, ArrowRight, Banknote } from "lucide-react";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 paynet-gradient rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PayAuth</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button>Criar Conta</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Pagamentos Seguros com
            <span className="text-primary"> Autenticação Avançada</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Plataforma completa de autenticação para soluções de pagamento com
            segurança bancária, validação de CEP e tecnologia de ponta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Por que escolher nosso sistema?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Desenvolvido com as melhores práticas de segurança e experiência do
            usuário.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-0 shadow-lg paynet-card">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Segurança Bancária</h3>
              <p className="text-muted-foreground">
                Proteção de nível bancário com criptografia avançada e
                conformidade PCI DSS para transações seguras.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg paynet-card">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Banknote className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Soluções de Pagamento
              </h3>
              <p className="text-muted-foreground">
                Integração completa com meios de pagamento brasileiros e
                validação automática de dados.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg paynet-card">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Performance Rápida</h3>
              <p className="text-muted-foreground">
                Processamento em tempo real com baixa latência para experiência
                de pagamento instantânea.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/40">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <div className="w-6 h-6 paynet-gradient rounded flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-primary-foreground" />
            </div>
            <span>PayAuth © 2024</span>
          </div>
          <p>Plataforma de pagamentos segura e confiável</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

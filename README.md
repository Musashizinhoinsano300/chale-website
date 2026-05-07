# Chalé — Site

Site institucional do Chalé Bar e Espaço de Eventos em Águas Formosas, MG.

## O que é

O **Chalé** é um bar e espaço de eventos que oferece:
- Drinks autorais e caipirinhas premium
- Comida japonesa (sushi, sashimi, temaki)
- Porções artesanais
- Música ao vivo e eventos especiais

## Como funciona

### Stack Tech
- **Backend**: Node.js + Express (servindo arquivos estáticos)
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Animações**: Three.js (3D hero), GSAP + ScrollTrigger
- **Formulário**: Envia via WhatsApp (link direto)

### Estrutura
```
chale-website/
├── server/
│   └── index.js          # Servidor Express
├── public/
│   ├── index.html        # Página principal
│   ├── css/
│   │   └── style.css     # Estilos
│   └── js/
│       ├── main.js       # Lógica geral (nav, formulário)
│       ├── animations.js # Animações GSAP
│       └── scene3d.js    # Cena Three.js
├── package.json
└── README.md
```

### Executando

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start
# ou
node server/index.js
```

O servidor inicia em `http://localhost:3000`.

### Deploy

O site pode ser feito deploy em qualquer serviço de hospedagem estática (Vercel, Netlify, etc.). Apenas a pasta `public` precisa ser servida.

## Seções do Site

1. **Hero** — Animação 3D com Particles + logo
2. **Sobre** — História do Chalé, localização, horários
3. **Cardápio** — Drinks, comida japonesa, porções com preços
4. **Eventos** — Timeline de eventos próximos
5. **Contato** — Formulário com WhatsApp e mapa

## Contato

- WhatsApp: (33) 9701-0366
- Instagram: @chale_af
- Endereço: Av. Belo Horizonte, 545 — Águas Formosas, MG

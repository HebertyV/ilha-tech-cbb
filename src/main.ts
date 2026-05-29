import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

// --- Interfaces para type safety ---
interface LinhaEnigma {
  eq: string[];
  res: number;
}

interface Desafio {
  titulo: string;
  linhas: LinhaEnigma[];
  linhaFinal: string[];
  resposta: number;
  explicacao: string[];
}

interface EntradaRanking {
  nome: string;
  tempo: number;
  tempoVisual: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-app">
      
      <div *ngIf="telaAtual === 'inicio'" class="tela-entrada">
        <div class="badge-evento">Feira das Profissões</div>
        
        <div class="logo-area">
          <div class="logo-cbb">CBB</div>
          <div class="logo-subtexto">Colégio Betel Brasileiro</div>
        </div>

        <h1>Ilha de Tecnologia</h1>
        <p class="slogan-escola">Descobrindo Propósitos</p>
        <p class="slogan-turma">⚡ 3ª Série: Compilando ideias, buildando propósitos.</p>
        
        <input class="input-nome" #nomeInput type="text" placeholder="Digite seu Nickname" (keyup.enter)="iniciarJogo(nomeInput.value)" />
        <button class="btn-primario" (click)="iniciarJogo(nomeInput.value)">Iniciar Sprint</button>

        <div class="ranking-box mini" *ngIf="ranking.length > 0">
          <h3>🏆 Recordes da Ilha</h3>
          <ul>
            <li *ngFor="let r of ranking.slice(0,3); let i = index">
              <span>{{ i + 1 }}º {{ r.nome }}</span> <span>{{ r.tempoVisual }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div *ngIf="telaAtual === 'jogo'" class="header-jogo">
        <div class="jogador">{{ nickname }}</div>
        <div class="vidas">❤️ Vidas: {{ tentativasRestantes }}</div>
        <div class="cronometro">⏱️ {{ tempoVisual }}</div>
      </div>

      <div *ngIf="telaAtual === 'jogo' && desafioAtual" class="tela-jogo">
        <h2>{{ desafioAtual.titulo }}</h2>
        <p class="instrucao">Lógica rápida: descubra os valores e resolva a última linha.</p>
        
        <div class="painel-enigma">
          <div class="linha" *ngFor="let linha of desafioAtual.linhas">
            <span>{{ linha.eq[0] }}</span> <span>{{ linha.eq[1] }}</span> <span>{{ linha.eq[2] }}</span> <span>{{ linha.eq[3] }}</span> <span>{{ linha.eq[4] }}</span> <span>=</span> <span class="resultado-linha">{{ linha.res }}</span>
          </div>
          <div class="linha final destaque">
            <span>{{ desafioAtual.linhaFinal[0] }}</span> <span>{{ desafioAtual.linhaFinal[1] }}</span> <span>{{ desafioAtual.linhaFinal[2] }}</span> <span>{{ desafioAtual.linhaFinal[3] }}</span> <span>{{ desafioAtual.linhaFinal[4] }}</span> <span>=</span>
            <input type="number" [(ngModel)]="respostaUsuario" placeholder="?" class="input-resposta" (keyup.enter)="verificarResposta()" />
          </div>
        </div>

        <p class="msg-erro" *ngIf="mensagemErro">{{ mensagemErro }}</p>

        <button class="btn-verificar" (click)="verificarResposta()" [disabled]="respostaUsuario === null">
          VERIFICAR RESPOSTA
        </button>
      </div>

      <div *ngIf="telaAtual === 'sucesso'" class="tela-fim">
        <div class="logo-area" style="margin-bottom: 15px;">
          <div class="logo-cbb">CBB</div>
        </div>
        <h1>Sprint Concluída! 🎉</h1>
        <div class="tempo-final">Seu tempo: <span>{{ tempoVisual }}</span></div>
        
        <div class="ranking-box">
          <h3>🏆 Hall da Fama - Top 5</h3>
          <ul>
            <li *ngFor="let r of ranking; let i = index" [class.destaque-ranking]="r.nome === nickname && r.tempo === tempoSegundos">
              <span class="posicao">#{{ i + 1 }}</span>
              <span class="nome-rk">{{ r.nome }}</span>
              <span class="tempo-rk">{{ r.tempoVisual }}</span>
            </li>
          </ul>
        </div>

        <ng-container *ngTemplateOutlet="explicacaoMatematica"></ng-container>
        <button class="btn-primario" (click)="reiniciar()">Próximo Jogador</button>
      </div>

      <div *ngIf="telaAtual === 'derrota'" class="tela-fim">
        <div class="logo-area" style="margin-bottom: 15px;">
          <div class="logo-cbb">CBB</div>
        </div>
        <h1 style="color: #ff5252;">Fim da Sprint! 🛑</h1>
        <p style="font-size: 16px; margin-bottom: 20px; color: #b3b9d6;">Parabéns pelo esforço, <strong>{{ nickname }}</strong>! O importante é exercitar o raciocínio.</p>
        
        <ng-container *ngTemplateOutlet="explicacaoMatematica"></ng-container>
        <button class="btn-primario" (click)="reiniciar()">Próximo Jogador</button>
      </div>

      <ng-template #explicacaoMatematica>
        <div class="explicacao" *ngIf="desafioAtual">
          <h3>O que acabou de acontecer?</h3>
          <p>Sem perceber, seu cérebro resolveu um <strong>Sistema de Equações de 1º Grau</strong> descobrindo variáveis ocultas!</p>
          <div class="traducao-matematica">
            <p *ngFor="let exp of desafioAtual.explicacao">{{ exp }}</p>
          </div>
          <p class="conclusao-edtech">Isso é <strong>Tecnologia Educacional</strong>: remover o bloqueio visual para o cérebro focar na lógica.</p>
        </div>
      </ng-template>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;0,800;1,600&display=swap');
    
    .container-app { font-family: 'Montserrat', sans-serif; background-color: #0f1642; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: #fff; padding: 20px; }
    .badge-evento { background: #0088cc; color: white; display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;}
    .logo-area { display: flex; flex-direction: column; align-items: center; margin-bottom: 15px; }
    .logo-cbb { color: #ffd600; font-size: 55px; font-weight: 900; letter-spacing: 2px; line-height: 1; }
    .logo-subtexto { color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 5px; opacity: 0.9; }
    h1 { color: #fff; margin-bottom: 0px; font-weight: 800; font-size: 32px;}
    h2 { color: #ffd600; font-size: 24px; margin-bottom: 5px; text-transform: uppercase; }
    .slogan-escola { font-weight: bold; color: #b3b9d6; margin-top: 5px; font-size: 18px; text-transform: uppercase; letter-spacing: 2px;}
    .slogan-turma { font-style: italic; color: #ffd600; margin: 25px 0; font-weight: 600; background: rgba(255, 214, 0, 0.1); padding: 10px; border-radius: 8px;}
    .tela-entrada { background: #1a2360; border-radius: 16px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); max-width: 450px; width: 100%; border-bottom: 5px solid #ffd600; }
    .input-nome { width: 100%; padding: 15px; margin: 15px 0; border: 2px solid #303f9f; background: #0f1642; color: #fff; border-radius: 8px; font-size: 16px; box-sizing: border-box; text-align: center; font-weight: bold; }
    .input-nome::placeholder { color: #6a74a8; }
    .btn-primario { background-color: #ffd600; color: #0f1642; border: none; padding: 15px 30px; font-size: 18px; font-weight: 800; border-radius: 8px; cursor: pointer; transition: 0.3s; width: 100%; text-transform: uppercase; }
    .btn-primario:hover { background-color: #ffea00; transform: translateY(-2px); }
    .header-jogo { width: 100%; max-width: 500px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: #1a2360; padding: 15px 20px; border-radius: 12px; border: 2px solid #ffd600; box-sizing: border-box; }
    .jogador { font-weight: bold; color: #b3b9d6; font-size: 14px;}
    .vidas { color: #ff5252; font-weight: bold; font-size: 16px; }
    .cronometro { font-size: 20px; font-weight: 800; color: #ffd600; }
    .tela-jogo { width: 100%; max-width: 500px; }
    .painel-enigma { background: #f4f7f6; color: #333; padding: 25px 15px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.4); margin-bottom: 20px; border-bottom: 5px solid #0088cc; display: flex; flex-direction: column; gap: 15px; font-size: 24px; font-weight: bold; }
    .linha { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
    .linha span { flex: 1; text-align: center; }
    .resultado-linha { color: #1a2360; font-size: 26px; }
    .linha.final { border-bottom: none; padding-bottom: 0; padding-top: 10px; background-color: #e8ebf2; border-radius: 8px; padding: 15px;}
    .linha.destaque { background-color: #fffae6; border: 2px dashed #ffd600; }
    .input-resposta { width: 80px; height: 50px; font-size: 24px; font-weight: bold; text-align: center; border: 3px solid #0088cc; border-radius: 8px; color: #1a2360; }
    .msg-erro { color: #ff5252; font-weight: bold; background: rgba(255,82,82,0.1); padding: 10px; border-radius: 8px; margin-top: -10px; margin-bottom: 15px;}
    .btn-verificar { background-color: #303f9f; color: #fff; border: none; padding: 15px; width: 100%; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; transition: 0.3s;}
    .btn-verificar:disabled { background-color: #1a2360; color: #6a74a8; cursor: not-allowed; }
    .btn-verificar:hover:not(:disabled) { background-color: #3f51b5; }
    .tela-fim { background: #1a2360; border-radius: 16px; padding: 30px; max-width: 500px; width: 100%; border-bottom: 5px solid #4caf50; }
    .tempo-final { font-size: 18px; margin-bottom: 20px; color: #b3b9d6; }
    .tempo-final span { font-size: 32px; color: #ffd600; font-weight: bold; display: block; margin-top: 5px; }
    .ranking-box { background: #0f1642; border-radius: 12px; padding: 15px; margin-bottom: 25px; border: 2px solid #ffd600; }
    .ranking-box h3 { color: #ffd600; margin-top: 0; margin-bottom: 15px; font-size: 18px; text-transform: uppercase;}
    .ranking-box ul { list-style: none; padding: 0; margin: 0; }
    .ranking-box li { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; border-bottom: 1px solid #1a2360; font-size: 16px; font-weight: bold;}
    .ranking-box li:last-child { border-bottom: none; }
    .posicao { color: #0088cc; width: 30px; text-align: left; }
    .nome-rk { flex: 1; text-align: left; color: #fff; }
    .tempo-rk { color: #4caf50; font-family: monospace; font-size: 18px; }
    .destaque-ranking { background: rgba(76, 175, 80, 0.2); border-radius: 5px; }
    .ranking-box.mini { margin-top: 25px; margin-bottom: 0; border-color: #303f9f; }
    .ranking-box.mini h3 { font-size: 14px; color: #b3b9d6; }
    .ranking-box.mini li { font-size: 14px; color: #8c9eff; }
    .explicacao { background: #0f1642; padding: 15px; border-radius: 12px; margin-bottom: 25px; text-align: left; border-left: 5px solid #0088cc; }
    .explicacao h3 { color: #ffd600; margin-top: 0; font-size: 16px;}
    .explicacao p { color: #fff; line-height: 1.4; font-size: 13px; }
    .traducao-matematica { background: #1a2360; padding: 10px; border-radius: 8px; margin: 10px 0; text-align: center; font-family: monospace; font-size: 15px; color: #4caf50; font-weight: bold; }
    .traducao-matematica p { margin: 3px 0; color: #4caf50; }
    .conclusao-edtech { color: #ffd600 !important; font-weight: bold; text-align: center; margin-top: 10px; }
  `]
})
export class App implements OnInit, OnDestroy {
  telaAtual = 'inicio';
  nickname = '';

  // --- Relógio: gerenciado por RxJS, sem setInterval nativo ---
  tempoSegundos = 0;
  private subscription: Subscription | null = null;

  // Getter puro: elimina a variável `tempoVisual` duplicada e a função `atualizarRelogio()`
  get tempoVisual(): string {
    const min = Math.floor(this.tempoSegundos / 60).toString().padStart(2, '0');
    const seg = (this.tempoSegundos % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
  }

  ranking: EntradaRanking[] = [];

  readonly listaDesafios: Desafio[] = [
    {
      titulo: 'Lógica Tech',
      linhas: [
        { eq: ['💻', '+', '💻', '+', '💻'], res: 30 },
        { eq: ['💻', '+', '📱', '+', '📱'], res: 50 },
        { eq: ['📱', '-', '🖱️'], res: 15 }
      ],
      linhaFinal: ['💻', '+', '📱', '+', '🖱️'],
      resposta: 35,
      explicacao: ['X + X + X = 30', 'X + Y + Y = 50', 'Y - Z = 15', 'X + Y + Z = ?']
    },
    {
      titulo: 'Foco nos Estudos',
      linhas: [
        { eq: ['🎒', '+', '🎒', '+', '🎒'], res: 60 },
        { eq: ['🎒', '+', '📚', '+', '📚'], res: 30 },
        { eq: ['📚', '-', '✏️'], res: 3 }
      ],
      linhaFinal: ['🎒', '+', '📚', '-', '✏️'],
      resposta: 23,
      explicacao: ['X + X + X = 60', 'X + Y + Y = 30', 'Y - Z = 3', 'X + Y - Z = ?']
    },
    {
      titulo: 'Missão Espacial',
      linhas: [
        { eq: ['🚀', '+', '🚀', '+', '🚀'], res: 15 },
        { eq: ['🚀', '+', '🛸', '+', '🛸'], res: 17 },
        { eq: ['🛸', '-', '⭐'], res: 4 }
      ],
      linhaFinal: ['🚀', '+', '🛸', '+', '⭐'],
      resposta: 13,
      explicacao: ['X + X + X = 15', 'X + Y + Y = 17', 'Y - Z = 4', 'X + Y + Z = ?']
    },
    {
      titulo: 'Intervalo Rápido',
      linhas: [
        { eq: ['🍕', '+', '🍕', '+', '🍕'], res: 30 },
        { eq: ['🍕', '+', '🍔', '+', '🍔'], res: 20 },
        { eq: ['🍔', '+', '🍟'], res: 9 }
      ],
      linhaFinal: ['🍕', '+', '🍔', '+', '🍟'],
      resposta: 19,
      explicacao: ['X + X + X = 30', 'X + Y + Y = 20', 'Y + Z = 9', 'X + Y + Z = ?']
    },
    {
      titulo: 'Laboratório',
      linhas: [
        { eq: ['🔬', '+', '🔬', '+', '🔬'], res: 18 },
        { eq: ['🔬', '+', '🧪', '+', '🧪'], res: 14 },
        { eq: ['🧪', '-', '🧬'], res: 2 }
      ],
      linhaFinal: ['🔬', '+', '🧪', '+', '🧬'],
      resposta: 12,
      explicacao: ['X + X + X = 18', 'X + Y + Y = 14', 'Y - Z = 2', 'X + Y + Z = ?']
    }
  ];

  desafioAtual: Desafio | null = null;
  private ultimoDesafioSorteado = -1;
  respostaUsuario: number | null = null;
  tentativasRestantes = 3;
  mensagemErro = '';

  // PLATFORM_ID garante que localStorage só é acessado no browser (seguro para SSR)
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const rankingSalvo = localStorage.getItem('ranking_edtech_cbb');
      if (rankingSalvo) {
        try {
          this.ranking = JSON.parse(rankingSalvo);
        } catch {
          this.ranking = [];
        }
      }
    }
  }

  // Chamado quando o componente é destruído — garante que o relógio nunca fique rodando
  // em background mesmo se o usuário navegar para fora de alguma forma.
  ngOnDestroy() {
    this.pararRelogio();
  }

  private pararRelogio() {
    this.subscription?.unsubscribe();
    this.subscription = null;
  }

  sortearDesafio() {
    let novoIndice: number;
    do {
      novoIndice = Math.floor(Math.random() * this.listaDesafios.length);
    } while (novoIndice === this.ultimoDesafioSorteado);

    this.ultimoDesafioSorteado = novoIndice;
    this.desafioAtual = this.listaDesafios[novoIndice];
  }

  iniciarJogo(nome: string) {
    if (nome.trim() === '') return;

    this.pararRelogio(); // Cancela qualquer relógio anterior antes de criar um novo

    this.nickname = nome;
    this.telaAtual = 'jogo';
    this.tempoSegundos = 0;
    this.tentativasRestantes = 3;
    this.mensagemErro = '';
    this.respostaUsuario = null;
    this.sortearDesafio();

    // interval() do RxJS roda dentro do NgZone — view atualiza a cada tick automaticamente
    this.subscription = interval(1000).subscribe(() => {
      this.tempoSegundos++;
      // tempoVisual é um getter: Angular re-calcula na próxima verificação de mudança,
      // que interval() dispara por rodar dentro da zona.
    });
  }

  verificarResposta() {
    if (this.respostaUsuario === null || !this.desafioAtual) return;

    if (this.respostaUsuario === this.desafioAtual.resposta) {
      this.pararRelogio();
      this.salvarRanking();
      this.telaAtual = 'sucesso';
    } else {
      this.tentativasRestantes--;
      if (this.tentativasRestantes > 0) {
        this.mensagemErro = `❌ Ops! Você ainda tem ${this.tentativasRestantes} chance(s).`;
        this.respostaUsuario = null;
      } else {
        this.pararRelogio();
        this.telaAtual = 'derrota';
      }
    }
  }

  salvarRanking() {
    const entrada: EntradaRanking = {
      nome: this.nickname,
      tempo: this.tempoSegundos,
      tempoVisual: this.tempoVisual
    };
    this.ranking.push(entrada);
    this.ranking.sort((a, b) => a.tempo - b.tempo);
    this.ranking = this.ranking.slice(0, 5);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('ranking_edtech_cbb', JSON.stringify(this.ranking));
    }
  }

  reiniciar() {
    this.pararRelogio();
    this.telaAtual = 'inicio';
    this.nickname = '';
    this.respostaUsuario = null;
    this.tempoSegundos = 0;
    this.mensagemErro = '';
  }
}

bootstrapApplication(App);

import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-app">
      
      <!-- TELA 1: ENTRADA -->
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

        <!-- RANKING NA TELA INICIAL (Opcional, mostra se já tiver alguém) -->
        <div class="ranking-box mini" *ngIf="ranking.length > 0">
          <h3>🏆 Recordes da Ilha</h3>
          <ul>
            <li *ngFor="let r of ranking.slice(0,3); let i = index">
              <span>{{ i + 1 }}º {{ r.nome }}</span> <span>{{ r.tempoVisual }}</span>
            </li>
          </ul>
        </div>

        <div class="creditos">
          Desenvolvido por Prof. Heberty Vieira
        </div>
      </div>

      <!-- HEADER COM CRONÔMETRO -->
      <div *ngIf="telaAtual !== 'inicio' && telaAtual !== 'fim'" class="header-jogo">
        <div class="jogador">Jogador: {{ nickname }}</div>
        <div class="cronometro">⏱️ {{ tempoVisual }}</div>
      </div>

      <!-- TELA 2: FASE 1 -->
      <div *ngIf="telaAtual === 'fase1'" class="tela-jogo">
        <h2>Fase 1: Aquecimento</h2>
        <p class="instrucao">Lógica simples: descubra os valores e some.</p>
        
        <div class="painel-enigma">
          <div class="linha"><span>💻</span> <span>+</span> <span>💻</span> <span>+</span> <span>💻</span> <span>=</span> <span class="resultado-linha">30</span></div>
          <div class="linha"><span>💻</span> <span>+</span> <span>📱</span> <span>+</span> <span>📱</span> <span>=</span> <span class="resultado-linha">50</span></div>
          <div class="linha"><span>📱</span> <span>-</span> <span>🖱️</span> <span>=</span> <span class="resultado-linha">15</span></div>
          <div class="linha final">
            <span>💻</span> <span>+</span> <span>📱</span> <span>+</span> <span>🖱️</span> <span>=</span>
            <input type="number" [(ngModel)]="respostaFase1" placeholder="?" class="input-resposta" />
          </div>
        </div>
        <button class="btn-verificar" [disabled]="!f1_correto" (click)="avancar('fase2')" [class.sucesso]="f1_correto">
          {{ f1_correto ? 'CORRETO! AVANÇAR' : 'PENSE MAIS...' }}
        </button>
      </div>

      <!-- TELA 3: FASE 2 -->
      <div *ngIf="telaAtual === 'fase2'" class="tela-jogo">
        <h2>Fase 2: Foco Total</h2>
        <p class="instrucao">Atenção aos sinais na última linha.</p>
        
        <div class="painel-enigma">
          <div class="linha"><span>🎒</span> <span>+</span> <span>🎒</span> <span>+</span> <span>🎒</span> <span>=</span> <span class="resultado-linha">60</span></div>
          <div class="linha"><span>🎒</span> <span>+</span> <span>📚</span> <span>+</span> <span>📚</span> <span>=</span> <span class="resultado-linha">30</span></div>
          <div class="linha"><span>📚</span> <span>-</span> <span>✏️</span> <span>=</span> <span class="resultado-linha">3</span></div>
          <div class="linha final">
            <span>🎒</span> <span>+</span> <span>📚</span> <span>-</span> <span>✏️</span> <span>=</span>
            <input type="number" [(ngModel)]="respostaFase2" placeholder="?" class="input-resposta" />
          </div>
        </div>
        <button class="btn-verificar" [disabled]="!f2_correto" (click)="avancar('fase3')" [class.sucesso]="f2_correto">
          {{ f2_correto ? 'EXCELENTE! ÚLTIMA FASE' : 'QUASE LÁ...' }}
        </button>
      </div>

      <!-- TELA 4: FASE 3 -->
      <div *ngIf="telaAtual === 'fase3'" class="tela-jogo">
        <h2>Fase 3: Nível Mestre EdTech</h2>
        <p class="instrucao">Cuidado! Você lembra das regras básicas de matemática?</p>
        
        <div class="painel-enigma">
          <div class="linha"><span>🧠</span> <span>+</span> <span>🧠</span> <span>+</span> <span>🧠</span> <span>=</span> <span class="resultado-linha">15</span></div>
          <div class="linha"><span>🧠</span> <span>+</span> <span>💡</span> <span>+</span> <span>💡</span> <span>=</span> <span class="resultado-linha">25</span></div>
          <div class="linha"><span>💡</span> <span>-</span> <span>🚀</span> <span>=</span> <span class="resultado-linha">6</span></div>
          <div class="linha final destaque">
            <span>🚀</span> <span>+</span> <span>🧠</span> <span>×</span> <span>💡</span> <span>=</span>
            <input type="number" [(ngModel)]="respostaFase3" placeholder="?" class="input-resposta" />
          </div>
        </div>
        <button class="btn-verificar" [disabled]="!f3_correto" (click)="avancar('fim')" [class.sucesso]="f3_correto">
          {{ f3_correto ? 'PERFEITO! FINALIZAR SPRINT' : 'ATENÇÃO AOS SINAIS...' }}
        </button>
      </div>

      <!-- TELA 5: SUCESSO -->
      <div *ngIf="telaAtual === 'fim'" class="tela-fim">
        
        <div class="logo-area" style="margin-bottom: 15px;">
          <div class="logo-cbb">CBB</div>
        </div>

        <h1>Sprint Concluída! 🎉</h1>
        <div class="tempo-final">Seu tempo: <span>{{ tempoVisual }}</span></div>
        
        <!-- RANKING TOP 5 -->
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

        <div class="explicacao">
          <h3>O que acabou de acontecer?</h3>
          <p>Sem perceber, você resolveu um <strong>Sistema de Equações de 1º Grau</strong> e aplicou regras de precedência!</p>
          <div class="traducao-matematica">
            <p>X + X + X = 15</p>
            <p>X + Y + Y = 25</p>
            <p>Y - Z = 6</p>
            <p>Z + X × Y = ?</p>
          </div
          <p class="conclusao-edtech">Isso é <strong>Tecnologia Educacional</strong>: remover o bloqueio visual para o cérebro focar na lógica.</p>
        </div>

        <button class="btn-primario" (click)="reiniciar()">Nova Sprint (Passar a Vez)</button>
      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;0,800;1,600&display=swap');
    
    .container-app {
      font-family: 'Montserrat', sans-serif; background-color: #0f1642; 
      min-height: 100vh; display: flex; flex-direction: column; justify-content: center;
      align-items: center; text-align: center; color: #fff; padding: 20px;
    }
    
    .badge-evento { background: #0088cc; color: white; display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;}
    
    .logo-area { display: flex; flex-direction: column; align-items: center; margin-bottom: 15px; }
    .logo-cbb { color: #ffd600; font-size: 55px; font-weight: 900; letter-spacing: 2px; line-height: 1; }
    .logo-subtexto { color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 5px; opacity: 0.9; }
    
    h1 { color: #fff; margin-bottom: 0px; font-weight: 800; font-size: 32px;}
    .slogan-escola { font-weight: bold; color: #b3b9d6; margin-top: 5px; font-size: 18px; text-transform: uppercase; letter-spacing: 2px;}
    .slogan-turma { font-style: italic; color: #ffd600; margin: 25px 0; font-weight: 600; background: rgba(255, 214, 0, 0.1); padding: 10px; border-radius: 8px;}
    
    .tela-entrada { background: #1a2360; border-radius: 16px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); max-width: 450px; width: 100%; border-bottom: 5px solid #ffd600; position: relative; }
    
    .input-nome { width: 100%; padding: 15px; margin: 15px 0; border: 2px solid #303f9f; background: #0f1642; color: #fff; border-radius: 8px; font-size: 16px; box-sizing: border-box; text-align: center; font-weight: bold; }
    .input-nome::placeholder { color: #6a74a8; }
    
    .btn-primario { background-color: #ffd600; color: #0f1642; border: none; padding: 15px 30px; font-size: 18px; font-weight: 800; border-radius: 8px; cursor: pointer; transition: 0.3s; width: 100%; text-transform: uppercase; }
    .btn-primario:hover { background-color: #ffea00; transform: translateY(-2px); }
    
    .creditos { margin-top: 30px; font-size: 12px; color: #6a74a8; opacity: 0.8; }

    .header-jogo { width: 100%; max-width: 500px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: #1a2360; padding: 15px 20px; border-radius: 12px; border: 2px solid #ffd600; box-sizing: border-box; }
    .jogador { font-weight: bold; color: #b3b9d6; }
    .cronometro { font-size: 24px; font-weight: 800; color: #ffd600; }

    .tela-jogo { width: 100%; max-width: 500px; }
    
    .painel-enigma { background: #f4f7f6; color: #333; padding: 25px 15px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.4); margin-bottom: 20px; border-bottom: 5px solid #0088cc; display: flex; flex-direction: column; gap: 15px; font-size: 22px; font-weight: bold; }
    .linha { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
    .linha span { flex: 1; text-align: center; }
    .resultado-linha { color: #1a2360; font-size: 26px; }
    .linha.final { border-bottom: none; padding-bottom: 0; padding-top: 10px; background-color: #e8ebf2; border-radius: 8px; padding: 15px;}
    .linha.destaque { background-color: #fffae6; border: 2px dashed #ffd600; }
    
    .input-resposta { width: 80px; height: 50px; font-size: 24px; font-weight: bold; text-align: center; border: 3px solid #0088cc; border-radius: 8px; color: #1a2360; }
    
    .btn-verificar { background-color: #303f9f; color: #8c9eff; border: none; padding: 15px; width: 100%; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: not-allowed; transition: 0.3s;}
    .btn-verificar.sucesso { background-color: #4caf50; color: #fff; cursor: pointer; font-size: 18px; box-shadow: 0 0 15px rgba(76,175,80,0.6); }

    .tela-fim { background: #1a2360; border-radius: 16px; padding: 30px; max-width: 500px; width: 100%; border-bottom: 5px solid #4caf50; }
    .tempo-final { font-size: 18px; margin-bottom: 20px; color: #b3b9d6; }
    .tempo-final span { font-size: 32px; color: #ffd600; font-weight: bold; display: block; margin-top: 5px; }

    /* ESTILOS DO RANKING */
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
export class App implements OnInit {
  telaAtual = 'inicio';
  nickname = '';
  
  tempoSegundos = 0;
  tempoVisual = '00:00';
  intervalo: any;

  // Array que vai guardar o ranking
  ranking: Array<{nome: string, tempo: number, tempoVisual: string}> = [];

  respostaFase1: number | null = null;
  get f1_correto() { return this.respostaFase1 === 35; }

  respostaFase2: number | null = null;
  get f2_correto() { return this.respostaFase2 === 23; }

  respostaFase3: number | null = null;
  get f3_correto() { return this.respostaFase3 === 54; }

  ngOnInit() {
    // Carrega o ranking salvo no navegador quando o app inicia
    const rankingSalvo = localStorage.getItem('ranking_edtech_cbb');
    if (rankingSalvo) {
      this.ranking = JSON.parse(rankingSalvo);
    }
  }

  atualizarRelogio() {
    const minutos = Math.floor(this.tempoSegundos / 60).toString().padStart(2, '0');
    const segundos = (this.tempoSegundos % 60).toString().padStart(2, '0');
    this.tempoVisual = `${minutos}:${segundos}`;
  }

  iniciarJogo(nome: string) {
    if(nome.trim() !== '') {
      this.nickname = nome;
      this.telaAtual = 'fase1';
      this.tempoSegundos = 0;
      this.atualizarRelogio();
      
      this.intervalo = setInterval(() => {
        this.tempoSegundos++;
        this.atualizarRelogio();
      }, 1000);
    }
  }

  avancar(proxima: string) {
    this.telaAtual = proxima;
    if (proxima === 'fim') {
      clearInterval(this.intervalo);
      this.salvarRanking();
    }
  }

  salvarRanking() {
    // Adiciona o jogador atual
    this.ranking.push({
      nome: this.nickname,
      tempo: this.tempoSegundos,
      tempoVisual: this.tempoVisual
    });

    // Ordena do menor tempo (mais rápido) para o maior
    this.ranking.sort((a, b) => a.tempo - b.tempo);

    // Corta a lista para manter apenas os 5 melhores
    this.ranking = this.ranking.slice(0, 5);

    // Salva de volta no navegador
    localStorage.setItem('ranking_edtech_cbb', JSON.stringify(this.ranking));
  }

  reiniciar() {
    this.respostaFase1 = null; 
    this.respostaFase2 = null; 
    this.respostaFase3 = null;
    this.telaAtual = 'inicio';
    this.nickname = '';
    this.tempoSegundos = 0;
    this.atualizarRelogio();
    clearInterval(this.intervalo);
  }
}

bootstrapApplication(App);

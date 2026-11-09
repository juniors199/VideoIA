/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
function o(){return`Ilustrando Studio: comandos do v\xEDdeo

Fazer um v\xEDdeo
  npm run video -- <projeto>            produz o v\xEDdeo do projeto (pasta projetos/<projeto>/ com roteiro.md)
  npm run prova                         v\xEDdeo de demonstra\xE7\xE3o sem voz, para provar que tudo funciona

Op\xE7\xF5es do v\xEDdeo (depois do nome do projeto)
  --voz=elevenlabs|fishaudio|arquivo|mock   qual voz usar (mock = sem som, n\xE3o gasta nada)
  --estilo=<id>  --objetivo=<id>            apar\xEAncia e tipo de p\xE1gina (npm run estilos / npm run objetivos listam)
  --rapido                                  pr\xE9via mais leve
  --sem-musica                              sem trilha (n\xE3o gasta cr\xE9dito de m\xFAsica)
  --formato=horizontal|vertical             formato do v\xEDdeo: horizontal = 1920 x 1080 (YouTube), vertical = 1080 x 1920 (padr\xE3o)
  --horizontal  --vertical                  o mesmo que --formato=...
  --handle  --sem-handle                    o @ do perfil no horizontal (vem desligado; no vertical sempre aparece)
  --forcar-horizontal                       (para quem migra estilos) produz horizontal num estilo ainda n\xE3o migrado
  --sem-legenda  --legenda                  desliga ou liga a legenda (vem ligada)
  --converter=horizontal|vertical           cria o projeto irm\xE3o no outro formato, com a mesma narra\xE7\xE3o e trilha (sem gastar cr\xE9dito)
                                            [--para=<nome>] [--produzir]
  --sem-render                              s\xF3 prepara, n\xE3o gera o v\xEDdeo
  --refazer-voz  --trocar-voz               narra de novo (gasta cr\xE9dito da voz)
  --so-capa                                 s\xF3 a capa

Conferir e diagnosticar
  npm run doctor [-- --json]            confere o computador (Node, FFmpeg, navegador, licen\xE7a, voz)
  npm run status [-- --json]            situa\xE7\xE3o dos projetos (um nome de projeto mostra s\xF3 ele)
  npm run comece -- --situacao [--json] o que falta para o primeiro v\xEDdeo, em uma tela

Licen\xE7a e voz sem abrir o est\xFAdio web
  npm run ativar -- <e-mail> --aceito   ativa a licen\xE7a neste computador
  npm run voz -- --situacao | --preparar | --conferir | --voz-padrao [nome]

Ajuda
  --ajuda                               este texto
`}export{o as textoAjuda};

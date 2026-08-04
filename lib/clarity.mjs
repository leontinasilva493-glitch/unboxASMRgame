export const CLARITY_PROJECT_ID = "xwv6r6wgv4";

export function buildClarityBootstrap(projectId) {
  const id = JSON.stringify(projectId);
  return `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=true;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window,document,"clarity","script",${id});`;
}

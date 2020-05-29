// Formatage de l'affichage de l'heure

export const displayDuration = (seconds, literalNotation=false) => {
  let m = Math.floor(seconds / 60);
  let h = Math.floor(m / 60);
  m = m % 60;
  let s = seconds % 60;

  if (literalNotation) {
    if (h < 1)
      return m + " min";

    if (m == 0)
      m = "";
    else if (m < 10)
      m = '0' + m;
    return h + " h " + m;
  }

  else {
    if (h > 0)
      return ((h > 9) ? h : "0" + h) + ":" + ((m > 9) ? m : "0" + m);
    else
      return ((m > 9) ? m : "0" + m) + ":" + ((s > 9) ? s : "0" + s);
  }
};
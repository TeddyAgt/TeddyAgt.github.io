const passwordDisplay = document.querySelector("#password");
const errorMsg = document.querySelector(".error-msg");
const passwordGeneratorForm = document.querySelector(
  ".password-generator-form"
);
const copyBtn = document.querySelector(".copy-btn");
const lengthRange = document.querySelector("#password-range");
const lengthText = document.querySelector("#length-text");
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

let length = lengthRange.value;
lengthText.textContent = `Taille du mot de passe: ${length}`;

passwordGeneratorForm.addEventListener("submit", generatePassword);
lengthRange.addEventListener("input", setLength);
copyBtn.addEventListener("click", copyToClipboard);

const authorizedCharsLists = {
  lowerCaseChars: createCharactersSet(97, 122),
  upperCaseChars: createCharactersSet(65, 90),
  digits: createCharactersSet(48, 57),
  specialChars: createCharactersSet(33, 47) + createCharactersSet(58, 64),

  /* Je commence à changer d'avis sur cette méthode, 
  quel interêt de recréer les sets à chaque fois plutôt que de les laisser en dur dans le code ? 🤔 */
};

function generatePassword(e) {
  e.preventDefault();
  const selectedOptions = selectCharsLists();
  /* Je le transforme en une seule chaîne de caractères sur laquelle je piocherai des caractères aléatoirement */
  const selectedCharacters = selectedOptions.join("");

  let minimalMandatoryCharacters = []; // Pour être sûr qu'il y ait au moins un caractère de chaque ensemble choisi par l'utilisateur avant de passer en mode totalement random
  let password = "";

  selectedOptions.forEach((list) => {
    minimalMandatoryCharacters.push(
      list[generateRandomNumber(0, list.length - 1)]
    );
  });

  for (let i = minimalMandatoryCharacters.length; i < length; i++) {
    /* Je ne pars pas de 0 car à ce stade on a déjà entre 1 et 4 caractères séléctionnés pour le mot de passe,
     on doit donc compléter pour atteindre la longueur souhaitée par l'utilisateur */
    password +=
      selectedCharacters[
        generateRandomNumber(0, selectedCharacters.length - 1)
      ];
  }

  /* Enfin on ajoute les premiers caractères séléctionnés au mot de passe */
  minimalMandatoryCharacters.forEach((item, index) => {
    /* Pour ne pas que les caractères en questions se retrouvent tous ensembles au début, 
    au milieu ou à la fin, je génère une dernière fois des indexes aléatoires pour les placer grâce à slice */
    const randomIndex = generateRandomNumber(0, password.length);
    password =
      password.slice(0, randomIndex) +
      minimalMandatoryCharacters[index] +
      password.slice(randomIndex);
  });

  passwordDisplay.textContent = password; // Enfin, j'affiche le mot de passe à l'utilisateur
}

function selectCharsLists() {
  /* Je choisis les listes de charactères à utiliser en fonction des options choisies par l'utilisateur */

  const selectedOptions = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedOptions.push(authorizedCharsLists[checkbox.id]);
    }
  });

  // Si le tableau est vide c'est que l'utilisateur n'a coché aucune option. Peu probable mais on vérifie quand même
  if (!selectedOptions.length) {
    errorMsg.textContent = "Il faut choisir au moins une option";
    return;
  }
  errorMsg.textContent = ""; // On réinitialise le message d'erreur au cas où il y a eu un essaie précédent
  return selectedOptions;
}

function setLength(e) {
  length = lengthRange.value;
  lengthText.textContent = `Taille du mot de passe: ${length}`;
}

function generateRandomNumber(min, max) {
  const randomNbr = crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296; // == 32 bits
  /* comme je divise le nombre obtenu par le nombre total de possibilité, 
  j'obtiens un résultat entre 0 et 1 non inclus comme la fonction Math.random, mais de manière plus sécurisée */
  return Math.trunc(randomNbr * (max - min + 1)) + min;
  /* Ensuite je fais comme on a l'habitude de faire avec Math.random mais remplacé par le nombre obtenu au dessus */
}

function createCharactersSet(startCharCode, endCharCode) {
  let charSet = "";

  for (let i = startCharCode; i <= endCharCode; i++) {
    charSet += String.fromCharCode(i);
    /* Voir la table ASCII https://www.ascii-code.com/fr. 
    Par exemple, entre 65 et 90 j'ai toutes les lettres majuscules (sans les caractères accentués) */
  }

  return charSet;
}

function copyToClipboard() {
  navigator.clipboard.writeText(passwordDisplay.textContent);
}

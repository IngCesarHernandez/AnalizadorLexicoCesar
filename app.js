const input = document.querySelector("#syntax");
const generate = document.querySelector("#analyze");
const outputContainer = document.querySelector("#outputContainer");
//Listener for input
generate.addEventListener("click", ()=>{

    if(input.value.trim() == 0){
        alert("Empty input");
            fillContainer();
        input.focus();
    }
    else
        outputContainer.innerHTML = automata(input.value);

});

//regex
const keyWords = /^(main|si|entonces|imprimir|salir|numb|cad|sino)$/g,
      reWhites = /\s+/g,
      reOneLineComment = /\/\/.*/g,
      reMultiLineComment = /\/[*](.|\n)*?[*]\//g,
      reCharacters = /[a-zA-Z_]\w*/g,
      reNumbers = /\b\d+(\.\d*)?([eE][+-]?\d+)?\b/g,
      reString = /('(\\.|[^'])*'|"(\\.|[^"])*")/g,
      reMultiOperator = /(===|!==|[+][+=]|-[-=]|=[=<>]|[<>][=<>]|&&|[|][|])/g,
      reSingleOperator = /([-+*\/=()&|;:,<>{}[\]])/g;

function automata(input){
    
    input = input.replace(reOneLineComment, "").replace(reMultiLineComment, "")+" ";
    let rows = "";
  
    let tempLexeme = "", nextChar = "";
    for (i = 0; i < input.length; i++){
       
        tempLexeme += input[i];
        nextChar = input[i+1] || ""; 

         //For Keyword: If on keywords array
          tempLexeme = tempLexeme.trimStart();
         if(tempLexeme.match(keyWords) && nextChar.match(reWhites)){
            
                    rows += getRow(0, tempLexeme)
                    tempLexeme = "";
            //For Strings: always start and end with either " or '
        }else if(tempLexeme[0] == "\"" || tempLexeme[0] == "\'"){
            
            //Detects malformed strings
            if(tempLexeme[tempLexeme.length-1].match(reSingleOperator)){

                rows += getRow(null, tempLexeme.replace(reSingleOperator, ""))
                tempLexeme = tempLexeme[tempLexeme.length-1]; 

            }else if(tempLexeme.match(reString)){

                rows += getRow(1, tempLexeme)
                tempLexeme = ""; 

            }
 
            //For Numbers: Any set of numbers followed by any operator, multiple operator or space
        }else if((nextChar.match(reSingleOperator) || nextChar.match(reWhites)) && tempLexeme.match(reNumbers)){
            
            rows += getRow(3, tempLexeme)
            tempLexeme = ""; 

          //For Id: Any set of chargs follow by any operator, multioperator or space that has no ' or "
        }else if((nextChar.match(reSingleOperator) || nextChar.match(reWhites))  && tempLexeme.match(reCharacters)){
            rows += getRow(2, tempLexeme)
            tempLexeme = ""; 

            //For MultiOperators: Any set of operators > 2
        }else if(nextChar.match(reSingleOperator) || tempLexeme.match(reMultiOperator)){

            if (tempLexeme.match(reMultiOperator)){

                rows += getRow(4, tempLexeme)
                tempLexeme = ""; 

            }               

            //For Operators: Any single operator
        }else if(tempLexeme.match(reSingleOperator)){
            
            for(k = 0; k < tempLexeme.length; k++){
                if(tempLexeme[k].match(reSingleOperator))
                    rows += getRow(5, tempLexeme[k]);
            }
            tempLexeme = ""; 

        }  



    } 
    if(rows.trim() == 0)
    rows += `   <tr>
                    <th>-</th>
                    <td>-</td>
                </tr>`;
    return rows;
}


function getTokenName(i){
    switch(i){
        case 0: return "Keyword"; //keyWords
        case 1: return "String"; //reString
        case 2: return "Id"; //reCharacters
        case 3: return "Number"; //reNumbers
        case 4: return "Comparison operator"; //reMultiOperator
        case 5: return "Operator"; //reOperator
        default: return "Unknown";
    };
} 

function getRow(nameIndex, lexeme){
    return `<tr>
                <th>${getTokenName(nameIndex)}</th>
                <td>${lexeme}</td>
            </tr>`;
}

function fillContainer(){
    outputContainer.innerHTML =`   <tr>
                    <th>-</th>
                    <td>-</td>
                </tr>`;
}

document.body.addEventListener("DOMContentLoaded", fillContainer());

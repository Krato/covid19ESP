export default function csvJSON(csv){
    let lines=csv.split("\n");
    let result = [];
    let headers=lines[0].split(",");
    let that = this;
    headers = headers.map(function(h) {
        h = h.toLowerCase(); 
        h = that.camelCase(h);
        return h.trim();
    });

    for(let i=1;i<lines.length;i++){
        let obj = {};
        let currentline=lines[i].split(",");

        for(let j=0;j<headers.length;j++){
            if(currentline[j]){
                obj[headers[j]] = currentline[j].trim();
            } else {
                obj[headers[j]] = "";
            }
        }
        result.push(obj);
    }
    return result;
}


// function string_to_slug(str) {

//     str = str.replace(/^\s+|\s+$/g, ''); // trim
//     str = str.toLowerCase();

//     // remove accents, swap ñ for n, etc
//     var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
//     var to   = "aaaaeeeeiiiioooouuuunc------";
//     for (var i=0, l=from.length ; i<l ; i++) {
//         str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
//     }

//     str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
//         .replace(/\s+/g, '-') // collapse whitespace and replace by -
//         .replace(/-+/g, '-'); // collapse dashes

//     return str;
// }
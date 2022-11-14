// adapted from finding footprints

function highlightItem(text, highlight, pre=``, suff=``, def=null) {
    if(def){
        if(!text){
            return def
        }
    }
    // Adapted from https://stackoverflow.com/questions/29652862/highlight-text-using-reactjs
    if (!highlight) {
      return text;
    }
    text = pre + text + suff;
    var highlightText = highlight.split(` `);
    var reg = `(`;
    for (var i in highlightText) {
      reg += highlightText[i];
      if (parseInt(i) !== highlightText.length - 1) {
        reg += `|`;
      }
    }
    reg += `)`;
    const parts = text.split(new RegExp(reg, "gi"));
    return (
      <span>
        {parts.map((part) =>
          highlight.toLowerCase().includes(part.toLowerCase()) ? (
            <mark className="marked-text m-0 p-0">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  }

function Highlight(props) {
    let by = props.by
    let pre = props.pre ? props.pre : ``
    let suff = props.suff ? props.suff : ``
    let def = props.def
    return highlightItem(props.children, by, pre, suff, def)
}

export default Highlight;

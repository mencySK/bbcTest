$.ajaxSetup({beforeSend: function(xhr){
  if (xhr.overrideMimeType)
  {
    xhr.overrideMimeType("application/json");
  }
}
});
var articleNumber = 1; //keep evidence of the current article
var rankArray = ['Article 1', 'Article 2', 'Article 3', 'Article 4', 'Article 5'];
 generateArticle(articleNumber);

function generateArticle(articleNumber) {
  $(this).scrollTop(0);
  $(document).ready(function() {
  //Getting data from JSON files
	$.getJSON(`article-${articleNumber}.json`,function(data){
  console.log(data);
  document.title=(data.title);
  document.getElementById("article").innerHTML =`
    ${Array(data.body.length).join(0).split(0).map((item, i) => `
     <link rel="preload" href="article-${articleNumber+1}.json" as="fetch">
      ${data.body[i].type=="paragraph" ?
      `<p>${data.body[i].model.text} </p>`
  : data.body[i].type=="image" ?
  `<img src=${data.body[i].model.url} class="center" alt=${data.body[i].model.altText} width=${data.body[i].model.width} height=${data.body[i].model.height}>`
  :data.body[i].type=="heading" ?
  `<h1 class="story-body"> ${data.body[i].model.text} </h1>`
  :data.body[i].type=="list" ?
  `
  <ul>
    ${Array(data.body[i].model.items.length).join(0).split(0).map((item, j) => `
      <li> ${data.body[i].model.items[j]} </li>
    `).join('')}

  </ul>


  `
  :'Error'}
    `).join('')} <!-- end of arrow -->

   <!-- Creating Back / Next buttons-->
    ${articleNumber==1 ?
      `<button onclick="generateArticle(++articleNumber)">Next</button>`
    : articleNumber==5 ?
      `<button onclick="generateArticle(--articleNumber)">Back</button>
      <button onclick="rankArticle() ">Rank Articles</button>`
    :
        `<button onclick="generateArticle(--articleNumber)">Back</button>
        <button onclick="generateArticle(++articleNumber)">Next</button>`

  }
`;

    });
  });
}

function rankArticle(){
  $(this).scrollTop(0);
	document.title=("Rank articles");
	document.getElementById("article").remove();
	document.getElementById("rankArticle").innerHTML =
`

<table class="rankTable">
<caption>Drag and drop the articles in any of the areas below</caption>
<tr>
  <th> Items to drag: </th>
<th>
  <div id="regroup">
  ${Array(rankArray.length).join(0).split(0).map((item, i) => `
    <div id="artToDrag${i+1}" draggable="true" ondragstart="drag(event)">
    ${rankArray[i]}
    </div>
    `).join('')}
  </div>
</th>
  <th id="ranks">Excellent</th>
  <th id="ranks">Very Good</th>
  <th id="ranks">Good</th>
  <th id="ranks">Decent</th>
  <th id="ranks">Bad</th>
</tr>

<tr>
  <th> </th>
  <th>Drop here ---> </th>
  ${Array(5).join(0).split(0).map((item, i) => `
    <th id="dropArea" ondrop="drop(event)" ondragover="allowDrop(event)"></th>
    `).join('')}
</tr>
</table>
<button id="submitButton"onclick="deleteCol(),DownloadData()">Submit Rank</button>
`;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

function DownloadData(){
  $("table").tableHTMLExport({
      type:'csv',
      filename:'sample.csv',
      htmlContent:'false',
    });

    alert("Thank you for your feedback !");
    document.getElementById("submitButton").remove();

}
function deleteCol(){
  $('table tr').find('td:eq(1),th:eq(1)').remove();
  $('table tr').find('td:eq(0),th:eq(0)').remove();
}

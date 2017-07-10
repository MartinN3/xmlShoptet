function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        displayContents(contents);
    };
    reader.readAsText(file);
}

function displayContents(contents) {
    var doc = contents.replace(/>\s+</g, "><");
    console.log(doc);

    start(doc)
}

document.getElementById('file-input').addEventListener('change', readSingleFile, false);


function start(xml) {
    const docSpec = {
            validate: function (jsElement) {
                //Validate the element:
                let elementSpec = docSpec.elements[jsElement.name];
                if (elementSpec.validate) elementSpec.validate(jsElement);
                //Cycle through the element's attributes:
//                for(var i=0; i<jsElement.attributes.length; i++) {
//                    var jsAttribute=jsElement.attributes[i];
//                    var attributeSpec=elementSpec.attributes[jsAttribute.name];
//                    if(attributeSpec.validate) attributeSpec.validate(jsAttribute);
                //Cycle through the element's children:
                for (let i = 0; i < jsElement.children.length; i++) {
                    let jsChild = jsElement.children[i];
                    if (jsChild.type == "element") { //if element
                        docSpec.validate(jsChild); //recursion
                    }
                }
            },
            elements: {
                "SHOP": {
                    menu: [
                        {
                            caption: "Append an <SHOPITEM> with variants",
                            action: Xonomy.newElementChild,
                            actionParameter: 'SHOPITEM-with-variants.xml'
                        },
                        {
                            caption: "Append an <SHOPITEM> (no variants)",
                            action: Xonomy.newElementChild,
                            actionParameter: 'SHOPITEM-with-variants.xml'
                        }
                    ]
                },
                "SHOPITEM": {
                    collapsed: function (jsElement) {
                        return true;
                    }
                },
                "CATEGORIES": {
                    menu: [{
                        caption: "Append an <CATEGORY>",
                        action: Xonomy.newElementChild,
                        actionParameter: 'CATEGORY.xml'
                    }]
                },
                "IMAGES": {
                    menu: [{
                        caption: "Append an <IMAGE>",
                        action: Xonomy.newElementChild,
                        actionParameter: 'IMAGE.xml'
                    }]
                }
                ,
                "IMAGE": {
                    canDropTo: ["IMAGES"]
                }
                ,
                "FLAGS": {
                    validate: function (jsChild) {
                        const zeroOrOne = jsChild.children.filter((el) =>
                            (el.getText() !== '1' && el.getText() !== '0')
                        );
                        Xonomy.warnings.push({
                            htmlID: zeroOrOne.map((el) => el.htmlID),
                            text: "This element must be 0 or 1."
                    });
                    }

                }
            }
        }
        ;
    const editor = document.getElementById("editor");
    Xonomy.setMode("laic");
    Xonomy.render(xml, editor, docSpec);
}

function save() {
    console.log(Xonomy.harvest())
}
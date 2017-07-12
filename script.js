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

function parseContents(contents) {
    let modifiedData = contents.replace(/>\s+</g, "><");
    return modifiedData.replace(/<!\[CDATA\[(.*?)\]\]>/g, "\$1");
}

function displayContents(contents) {
    var doc = parseContents(contents);

    start(doc)
}

document.getElementById('file-input').addEventListener('change', readSingleFile, false);

function start(xml) {
    //Validation functions for SHOPTET

    //Docspec for Xonomy
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
                        // {
                        //     caption: "Přidejte <SHOPITEM> with variants",
                        //     action: Xonomy.newElementChild,
                        //     actionParameter: xmlBank.shopitemVariants
                        // },
                        {
                            caption: "Přidejte <SHOPITEM> (no variants)",
                            action: Xonomy.newElementChild,
                            actionParameter: xmlBank.shopitem
                        },
                        {
                            caption: "Přidejte <SHOPITEMDEMO> DEMO",
                            action: Xonomy.newElementChild,
                            actionParameter: xmlBank.shopitemDemo
                        }
                    ]
                },
                "SHOPITEM": {
                    collapsed: function (jsElement) {
                        return true;
                    },
                    menu: [{
                        caption: "Odstranit <SHOPITEM>",
                        action: Xonomy.deleteElement
                    }]
                },
                "NAME": {
                    collapsed: function(jsElement){return false},
                    hasText: true,
                },
                "SHORT_DESCRIPTION": {
                    isReadOnly: false,
                    hasText: false,
                    collapsed: function(jsElement){return false},
                },
                "CATEGORIES": {
                    menu: [{
                        caption: "Přidejte <CATEGORY>",
                        action: Xonomy.newElementChild,
                        actionParameter: xmlBank.category
                        },
                        {
                        caption: "Přidejte <DEFAULT_CATEGORY>",
                        action: Xonomy.newElementChild,
                        actionParameter: xmlBank.defaultCategory
                        }]
                },
                "CATEGORY": {
                    menu: [{
                        caption: "Odstranit <CATEGORY>",
                        action: Xonomy.deleteElement
                    }]
                },
                "IMAGES": {
                    menu: [{
                        caption: "Přidejte <IMAGE>",
                        action: Xonomy.newElementChild,
                        actionParameter: xmlBank.image
                    }]
                },
                "IMAGE": {
                    canDropTo: ["IMAGES"],
                    menu: [{
                        caption: "Odstranit <IMAGE>",
                        action: Xonomy.deleteElement
                    }]
                },
                "TEXT_PROPERTIES": {
                    menu: [{
                        caption: "Přidejte <TEXT_PROPERTY>",
                        action: Xonomy.newElementChild,
                        actionParameter: xmlBank.textProperty
                    }]
                },
                "TEXT_PROPERTY": {
                    menu: [{
                        caption: "Odstranit <TEXT_PROPERTY>",
                        action: Xonomy.deleteElement
                    }]
                },
                "RELATED_PRODUCTS": {
                    menu: [{
                        caption: "Přidejte <CODE>",
                        action: Xonomy.newElementChild,
                        actionParameter: xmlBank.code
                    }]
                },
                "ALTERNATIVE_PRODUCTS": {
                    menu: [{
                        caption: "Přidejte <CODE>",
                        action: Xonomy.newElementChild,
                        actionParameter: xmlBank.code
                    }]
                },
                "CODE": {
                    menu: [{
                        caption: "Odstranit <CODE>",
                        action: Xonomy.deleteElement
                    }]
                },
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
                },
                "p": {
                    attributes: {},
                    menu: [
                        {caption: "New <p> before this", action: Xonomy.newElementBefore, actionParameter: "<p/>", hideIf: function(jsElement){return false}},
                        {caption: "New <p> after this", action: Xonomy.newElementAfter, actionParameter: "<p/>", hideIf: function(jsElement){return false}},
                        {caption: "Delete", action: Xonomy.deleteElement, actionParameter: null, hideIf: function(jsElement){return false}}
                    ],
                    collapsed: function(jsElement){return false},
                    hasText: true,
                    inlineMenu: [
                        {caption: "<em> (italic)", action: Xonomy.wrap, actionParameter: {template: "<em>$</em>", placeholder: "$"}, hideIf: function(jsElement){return false}},
                        {caption: "<strong> (bold)", action: Xonomy.wrap, actionParameter: {template: "<strong>$</strong>", placeholder: "$"}, hideIf: function(jsElement){return false}},
                        {caption: "<u> (underline)", action: Xonomy.wrap, actionParameter: {template: "<u>$</u>", placeholder: "$"}, hideIf: function(jsElement){return false}},
                        {caption: "<a> (external link)", action: Xonomy.wrap, actionParameter: {template: "<a href=''>$</a>", placeholder: "$"}, hideIf: function(jsElement){return false}},
                    ]
                },
                //inline textual elements:
                "em": {
                    backgroundColour: "#d6ffd6",
                    attributes: {},
                    menu: [
                        {caption: "Unwrap", action: Xonomy.unwrap, actionParameter: null, hideIf: function(jsElement){return false}}
                    ],
                    canDropTo: [],
                    mustBeAfter: [],
                    mustBeBefore: [],
                    collapsible: false,
                    oneliner: true,
                    hasText: true,
                    inlineMenu: [
                        {caption: "<strong> (bold)", action: Xonomy.wrap, actionParameter: {template: "<strong>$</strong>", placeholder: "$"}, hideIf: function(jsElement){return false}},
                        {caption: "<u> (underline)", action: Xonomy.wrap, actionParameter: {template: "<u>$</u>", placeholder: "$"}, hideIf: function(jsElement){return false}}
                    ]
                },
                "strong": {
                    backgroundColour: "#d6ffd6",
                    attributes: {},
                    menu: [
                        {caption: "Unwrap", action: Xonomy.unwrap, actionParameter: null, hideIf: function(jsElement){return false}}
                    ],
                    canDropTo: [],
                    mustBeAfter: [],
                    mustBeBefore: [],
                    collapsible: false,
                    oneliner: true,
                    hasText: true,
                    inlineMenu: [
                        {caption: "<em> (italic)", action: Xonomy.wrap, actionParameter: {template: "<em>$</em>", placeholder: "$"}, hideIf: function(jsElement){return false}},
                        {caption: "<u> (underline)", action: Xonomy.wrap, actionParameter: {template: "<u>$</u>", placeholder: "$"}, hideIf: function(jsElement){return false}}
                    ]
                },
                "u": {
                    backgroundColour: "#d6ffd6",
                    attributes: {},
                    menu: [
                        {caption: "Unwrap", action: Xonomy.unwrap, actionParameter: null, hideIf: function(jsElement){return false}}
                    ],
                    canDropTo: [],
                    mustBeAfter: [],
                    mustBeBefore: [],
                    collapsible: false,
                    oneliner: true,
                    hasText: true,
                    inlineMenu: [
                        {caption: "<em> (italic)", action: Xonomy.wrap, actionParameter: {template: "<em>$</em>", placeholder: "$"}, hideIf: function(jsElement){return false}},
                        {caption: "<strong> (bold)", action: Xonomy.wrap, actionParameter: {template: "<strong>$</strong>", placeholder: "$"}, hideIf: function(jsElement){return false}}
                    ]
                },
                "a": { //an external link
                    backgroundColour: "#d6ffd6",
                    attributes: {
                        "href": {
                            asker: Xonomy.askString,
                            askerParameter: null,
                            explainer: null,
                            menu: [],
                            validate: function(jsAttribute) {
                                if($.trim(jsAttribute.value)=="") {
                                    Xonomy.warnings.push({htmlID: jsAttribute.htmlID, text: "The @href attribute should not be empty."});
                                    return false;
                                }
                                return true;
                            },
                        }
                    },
                    menu: [
                        {caption: "Unwrap", action: Xonomy.unwrap, actionParameter: null, hideIf: function(jsElement){return false}}
                    ],
                    canDropTo: [],
                    mustBeAfter: [],
                    mustBeBefore: [],
                    collapsed: function(jsElement){return true},
                    oneliner: true,
                    hasText: true,
                    inlineMenu: []
                },
            }
        }
        ;
    const editor = document.getElementById("editor");
    Xonomy.setMode("laic");
    Xonomy.render(xml, editor, docSpec);
    save('imports');
}

function save(saveCaller) {
    let content = Xonomy.harvest();
    console.log(content);

    content = content.replace(/>(<p>(.*?)<\/p>)<\//g, "><!\[CDATA\[\$1\]\]></");
    console.log(content);

    request = $.ajax({
        url: "/xmlHarvest.php",
        type: "post",
        data: {
            save: saveCaller,
            xml: content
        }
    });

    request.done(function (response, textStatus, jqXHR){
        switch(saveCaller) {
            case 'autosave':
                notifyMe('Autosave proběhl úspěšně');
                return;
            case 'export':
                location.replace('http://xmltoarray.test/xmlDownload.php')
        }
    });

    request.fail(function (jqXHR, textStatus, errorThrown){
        console.error(
            "The following error occurred: "+
            textStatus, errorThrown
        );
    });
}

function autoSave() {
    request = $.ajax({
        url: "/xmlHarvest.php",
        type: "post",
        data: {xml: Xonomy.harvest()}
    });

    request.done(function (response, textStatus, jqXHR){
        location.replace('http://xmltoarray.test/xmlDownload.php')
    });

    request.fail(function (jqXHR, textStatus, errorThrown){
        console.error(
            "The following error occurred: "+
            textStatus, errorThrown
        );
    });
}

setInterval(function(){
    save('autosave');
}, 120000); //300000

function prepareXML(xml) {
    if (xml=="") {
        return;
    }

    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(this.response);
        };
        xhr.onerror = reject;
        xhr.open("GET","xmlBank.php?q="+xml,true);
        xhr.send();
    })
}


prepareXML('./IMAGE.xml')
    .then(function(result) {
        xmlBank['image'] = parseContents(result);
    })
    .catch(function(reject) {
        console.log(reject);
    });

prepareXML('./SHOPITEM-no-variants.xml')
    .then(function(result) {
        xmlBank['shopitem'] = parseContents(result);
    })
    .catch(function(reject) {
        console.log(reject);
    });

prepareXML('./SHOPITEM-demo.xml')
    .then(function(result) {
        xmlBank['shopitemDemo'] = parseContents(result);
    })
    .catch(function(reject) {
        console.log(reject);
    });

prepareXML('./CATEGORY.xml')
    .then(function(result) {
        xmlBank['category'] = parseContents(result);
    })
    .catch(function(reject) {
        console.log(reject);
    });

prepareXML('./TEXT_PROPERTY.xml')
    .then(function(result) {
        xmlBank['textProperty'] = parseContents(result);
    })
    .catch(function(reject) {
        console.log(reject);
    });

prepareXML('./CODE.xml')
    .then(function(result) {
        xmlBank['code'] = parseContents(result);
    })
    .catch(function(reject) {
        console.log(reject);
    });

prepareXML('./DEFAULT_CATEGORY.xml')
    .then(function(result) {
        xmlBank['defaultCategory'] = parseContents(result);
    })
    .catch(function(reject) {
        console.log(reject);
    });


var xmlBank = {}

function notifyMe(notificationText) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(notificationText);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(notificationText);
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}
1. Conformance

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

Any point, at which a conforming UA must make decisions about the state or reaction to the state of the conceptual model, is captured as algorithm. The algorithms are defined in terms of processing equivalence. The processing equivalence is a constraint imposed on the algorithm implementors, requiring the output of the both UA-implemented and the specified algorithm to be exactly the same for all inputs.

The IDL fragments in this specification must be interpreted as required for conforming IDL fragments, as described in the Web IDL specification [WEBIDL].

2. HTML: Custom elements

2.1 Introduction

This section is non-normative.

Custom elements provide a way for authors to build their own fully-featured DOM elements. Although authors could always use non-standard elements in their documents, with application-specific behaviour added after the fact by scripting or similar, such elements have historically been non-conforming and not very functional. By defining a custom element, authors can inform the parser how to properly construct an element and how elements of that class should react to changes.

Custom elements are part of a larger effort to "rationalise the platform", by explaining existing platform features (like the elements of HTML) in terms of lower-level author-exposed extensibility points (like custom element definition). Although today there are many limitations on the capabilities of custom elements—both functionally and semantically—that prevent them from fully explaining the behaviours of HTML's existing elements, we hope to shrink this gap over time.

2.1.1 Creating an autonomous custom element

This section is non-normative.

For the purposes of illustrating how to create an autonomous custom element, let's define a custom element that encapsulates rendering a small icon for a country flag. Our goal is to be able to use it like so:

<flag-icon country="nl"></flag-icon>
To do this, we first declare a class for the custom element, extending HTMLElement:

class FlagIcon extends HTMLElement {
  constructor() {
    super();
    this._countryCode = null;
  }

  static get observedAttributes() { return ["country"]; }

  attributeChangedCallback(name, oldValue, newValue) {
    // name will always be "country" due to observedAttributes
    this._countryCode = newValue;
    this._updateRendering();
  }
  connectedCallback() {
    this._updateRendering();
  }

  get country() {
    return this._countryCode;
  }
  set country(v) {
    this.setAttribute("country", v);
  }

  _updateRendering() {
    // Left as an exercise for the reader. But, you'll probably want to
    // check this.ownerDocument.defaultView to see if we've been
    // inserted into a document with a browsing context, and avoid
    // doing any work if not.
  }
}
We then need to use this class to define the element:

customElements.define("flag-icon", FlagIcon);
At this point, our above code will work! The parser, whenever it sees the flag-icon tag, will construct a new instance of our FlagIcon class, and tell our code about its new country attribute, which we then use to set the element's internal state and update its rendering (when appropriate).

You can also create flag-icon elements using the DOM API:

const flagIcon = document.createElement("flag-icon")
flagIcon.country = "jp"
document.body.appendChild(flagIcon)
Finally, we can also use the custom element constructor itself. That is, the above code is equivalent to:

const flagIcon = new FlagIcon()
flagIcon.country = "jp"
document.body.appendChild(flagIcon)
2.1.2 Creating a customized built-in element

This section is non-normative.

Customized built-in elements are a distinct kind of custom element, which are defined slightly differently and used very differently compared to autonomous custom elements. They exist to allow reuse of behaviours from the existing elements of HTML, by extending those elements with new custom functionality. This is important since many of the existing behaviours of HTML elements can unfortunately not be duplicated by using purely autonomous custom elements. Instead, customized built-in elements allow the installation of custom construction behaviour, lifecycle hooks, and prototype chain onto existing elements, essentially "mixing in" these capabilities on top of the already-existing element.

Customized built-in elements require a distinct syntax from autonomous custom elements because user agents and other software key off an element's local name in order to identify the element's semantics and behaviour. That is, the concept of customized built-in elements building on top of existing behaviour depends crucially on the extended elements retaining their original local name.

In this example, we'll be creating a customized built-in element named plastic-button, which behaves like a normal button but gets fancy animation effects added whenever you click on it. We start by defining a class, just like before, although this time we extend HTMLButtonElement instead of HTMLElement:

class PlasticButton extends HTMLButtonElement {
  constructor() {
    super();

    this.addEventListener("click", () => {
      // Draw some fancy animation effects!
    });
  }
}
When defining our custom element, we have to also specify the extends option:

customElements.define("plastic-button", PlasticButton, { extends: "button" });
In general, the name of the element being extended cannot be determined simply by looking at what element interface it extends, as many elements share the same interface (such as q and blockquote both sharing HTMLQuoteElement).

To use our customized built-in element, we use the is attribute on a button element:

<button is="plastic-button">Click Me!</button>
Trying to use a customized built-in element as an autonomous custom element will not work; that is, <plastic-button>Click me?</plastic-button> will simply create an HTMLElement with no special behaviour.

If you need to create a type-extended element programmatically, you can use the following form of createElement():

const plasticButton = document.createElement("button", { is: "plastic-button" });
plasticButton.textContent = "Click me!";
And as before, the constructor will also work:

const plasticButton2 = new PlasticButton();
console.log(plasticButton2.localName);          // will output "button"
console.log(plasticButton2.getAttribute("is")); // will output "plastic-button"
Notably, all the of the ways in which button is special apply to such "plastic buttons" as well: their focus behaviour, ability to participate in form submission, the disabled attribute, and so on.

2.1.3 Drawbacks of autonomous custom elements

This section is non-normative.

As specified below, and alluded to above, simply defining and using an element called taco-button does not mean that such elements represent buttons. That is, tools such as Web browsers, search engines, or accessibility technology will not automatically treat the resulting element as a button just based on its defined name.

To convey the desired button semantics to a variety of users, while still using an autonomous custom element, a number of techniques would need to be employed:

The addition of the tabindex attribute would make the taco-button interactive content, thus making it focusable. Note that if the taco-button were to become logically disabled, the tabindex attribute would need to be removed.

The addition of various ARIA attributes helps convey semantics to accessibility technology. For example, setting the role attribute to "button" will convey the semantics that this is a button, enabling users to successfully interact with the control using usual button-like interactions in their accessibility technology. Setting the aria-label attribute is necessary to give the button an accessible name, instead of having accessibility technology traverse its child text nodes and announce them. And setting aria-disabled to "true" when the button is logically disabled conveys to accessibility technology the button's disabled state.

The addition of event handlers to handle commonly-expected button behaviours helps convey the semantics of the button to Web browser users. In this case, the most relevant event handler would be one that proxies appropriate keydown events to become click events, so that you can activate the button both with keyboard and by clicking.

In addition to any default visual styling provided for taco-button elements, the visual styling will also need to be updated to reflect changes in logical state, such as becoming disabled; that is, whatever stylesheet has rules for taco-button will also need to have rules for taco-button[disabled].

With these points in mind, a full-featured taco-button that took on the responsibility of conveying button semantics (including the ability to be disabled) might look something like this:

class TacoButton extends HTMLElement {
  static get observedAttributes() { return ["disabled"]; }

  constructor() {
    super();

    this.addEventListener("keydown", e => {
      if (e.keyCode === 32 || e.keyCode === 13) {
        this.dispatchEvent(new MouseEvent("click", {
          bubbles: true,
          cancelable: true
        }));
      }
    });

    this.addEventListener("click", e => {
      if (this.disabled) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    this._observer = new MutationObserver(() => {
      this.setAttribute("aria-label", this.textContent);
    });
  }

  connectedCallback() {
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", "0");

    this._observer.observe(this, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  disconnectedCallback() {
    this._observer.disconnect();
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(v) {
    if (v) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  attributeChangedCallback() {
    // only is called for the disabled attribute due to observedAttributes
    if (this.disabled) {
      this.removeAttribute("tabindex");
      this.setAttribute("aria-disabled", "true");
    } else {
      this.setAttribute("tabindex", "0");
      this.setAttribute("aria-disabled", "false");
    }
  }
}
Even with this rather-complicated element definition, the element is not a pleasure to use for consumers: it will be continually "sprouting" tabindex and aria-* attributes of its own volition. This is because as of now there is no way to specify default accessibility semantics or focus behaviour for custom elements, forcing the use of these attributes to do so (even though they are usually reserved for allowing the consumer to override default behaviour).

In contrast, a simple customized built-in element, as shown in the previous section, would automatically inherit the semantics and behaviour of the button element, with no need to implement these behaviours manually. In general, for any elements with nontrivial behaviour and semantics that build on top of existing elements of HTML, customized built-in elements will be easier to develop, maintain, and consume.

2.1.4 Upgrading elements after their creation

This section is non-normative.

Because element definition can occur at any time, a non-custom element could be created, and then later become a custom element after an appropriate definition is registered. We call this process "upgrading" the element, from a normal element into a custom element.

Upgrades enable scenarios where it may be preferable for custom element definitions to be registered after relevant elements has been initially created, such as by the parser. They allow progressive enhancement of the content in the custom element. For example, in the following HTML document the element definition for img-viewer is loaded asynchronously:

<!DOCTYPE html>
<html lang="en">
<title>Image viewer example</title>

<img-viewer filter="Kelvin">
  <img src="images/tree.jpg" alt="A beautiful tree towering over an empty savannah">
</img-viewer>

<script src="js/elements/img-viewer.js" async></script>
The definition for the img-viewer element here is loaded using a script element marked with the async attribute, placed after the <img-viewer> tag in the markup. While the script is loading, the img-viewer element will be treated as an undefined element, similar to a span. Once the script loads, it will define the img-viewer element, and the existing img-viewer element on the page will be upgraded, applying the custom element's definition (which presumably includes applying an image filter identified by the string "Kelvin", enhancing the image's visual appearance).

Note that upgrades only apply to elements in the document tree. (Formally, elements that are connected.) An element that is not inserted into a document will stay un-upgraded. An example illustrates this point:

<!DOCTYPE html>
<html lang="en">
<title>Upgrade edge-cases example</title>

<example-element></example-element>

<script>
  "use strict";

  const inDocument = document.querySelector("example-element");
  const outOfDocument = document.createElement("example-element");

  // Before the element definition, both are HTMLElement:
  console.assert(inDocument instanceof HTMLElement);
  console.assert(outOfDocument instanceof HTMLElement);

  class ExampleElement extends HTMLElement {}
  customElements.define("example-element", ExampleElement);

  // After element definition, the in-document element was upgraded:
  console.assert(inDocument instanceof ExampleElement);
  console.assert(!(outOfDocument instanceof ExampleElement));

  document.body.appendChild(outOfDocument);

  // Now that we've moved the element into the document, it too was upgraded:
  console.assert(outOfDocument instanceof ExampleElement);
</script>
2.2 Requirements for custom element constructors

When authoring custom element constructors, authors are bound by the following conformance requirements:

A parameter-less call to super() must be the first statement in the constructor body, to establish the correct prototype chain and this value before any further code is run.

A return statement must not appear anywhere inside the constructor body, unless it is a simple early-return (return or return this).

The constructor must not use the document.write() or document.open() methods.

The element's attributes and children must not be inspected, as in the non-upgrade case none will be present, and relying on upgrades makes the element less usable.

The element must not gain any attributes or children, as this violates the expectations of consumers who use the createElement or createElementNS methods.

In general, work should be deferred to connectedCallback as much as possible—especially work involving fetching resources or rendering. However, note that connectedCallback can be called more than once, so any initialization work that is truly one-time will need a guard to prevent it from running twice.

In general, the constructor should be used to set up initial state and default values, and to set up event listeners and possibly a shadow root.

Several of these requirements are checked during element creation, either directly or indirectly, and failing to follow them will result in a custom element that cannot be instantiated by the parser or DOM APIs.

2.3 Core concepts

A custom element is an element that is custom. Informally, this means that its constructor and prototype are defined by the author, instead of by the user agent. This author-supplied constructor function is called the custom element constructor.

Two distinct types of custom elements can be defined:

An autonomous custom element, which is defined with no extends option. These types of custom elements have a local name equal to their defined name.

A customized built-in element, which is defined with an extends option. These types of custom elements have local name equal to the value passed in their extends option, and their defined name is used as the value of the is attribute.

After a custom element is created, changing the value of the is attribute does not change the element's behaviour, as it is saved on the element as its is value.

Autonomous custom elements have the following element definition:

Categories:
Flow content.
Phrasing content.
Palpable content.
Contexts in which this element can be used:
Where phrasing content is expected.
Content model:
Transparent.
Content attributes:
Global attributes, except the is attribute
Any other attribute that has no namespace (see prose).
DOM interface:
Supplied by the element's author (inherits from HTMLElement)
An autonomous custom element does not have any special meaning: it represents its children. A customized built-in element inherits the semantics of the element that it extends.

Any namespace-less attribute that is relevant to the element's functioning, as determined by the element's author, may be specified on an autonomous custom element, so long as the attribute name is XML-compatible and contains no uppercase ASCII letters. The exception is the is attribute, which must not be specified on an autonomous custom element (and which will have no effect if it is).

Customized built-in elements follow the normal requirements for attributes, based on the elements they extend. To add custom attribute-based behavior, use data-* attributes.

A valid custom element name is a sequence of characters name that meets all of the following requirements:

name must match the PotentialCustomElementName production:

PotentialCustomElementName ::=
[a-z] (PCENChar)* '-' (PCENChar)*
PCENChar ::=
"-" | "." | [0-9] | "_" | [a-z] | #xB7 | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x203F-#x2040] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
This uses the EBNF notation from the XML specification. [XML]

name must not be any of the following:

annotation-xml
color-profile
font-face
font-face-src
font-face-uri
font-face-format
font-face-name
missing-glyph
NOTE
The list of names above is the summary of all hyphen-containing element names from the applicable specifications, namely SVG and MathML. [SVG] [MATHML]

NOTE
These requirements ensure a number of goals for valid custom element names:

They start with a lowercase ASCII letter, ensuring that the HTML parser will treat them as tags instead of as text.

They do not contain any uppercase ASCII letters, ensuring that the user agent can always treat HTML elements ASCII-case-insensitively.

They contain a hyphen, used for namespacing and to ensure forward compatibility (since no elements will be added to HTML, SVG, or MathML with hyphen-containing local names in the future).

They can always be created with createElement() and createElementNS(), which have restrictions that go beyond the parser's.

Apart from these restrictions, a large variety of names is allowed, to give maximum flexibility for use cases like <math-α> or <emotion-😍>.

A custom element definition describes a custom element and consists of:

A name
A valid custom element name
A local name
A local name
A constructor
A custom element constructor
A prototype
A JavaScript object
A list of observed attributes
A sequence<DOMString>
A collection of lifecycle callbacks
A map, whose four keys are the strings "connectedCallback", "disconnectedCallback", "adoptedCallback", and "attributeChangedCallback". The corresponding values are either a Web IDL Function callback function type value, or null. By default the value of each entry is null.
A construction stack
A list, initially empty, that is manipulated by the upgrade an element algorithm and the HTML element constructors. Each entry in the list will be either an element or an already constructed marker.
To look up a custom element definition, given a document, namespace, localName, and is, perform the following steps. They will return either a custom element definition or null:

If namespace is not the HTML namespace, return null.

If document does not have a browsing context, return null.

Let registry be document's browsing context's Window's CustomElementRegistry object.

If there is custom element definition in registry with name and local name both equal to localName, return that custom element definition.

If there is a custom element definition in registry with name equal to is and local name equal to localName, return that custom element definition.

Return null.

2.4 The CustomElementRegistry interface

Each Window object is associated with a unique instance of a CustomElementRegistry object, allocated when the Window object is created.

NOTE
Custom element registries are associated with Window objects, instead of Document objects, since each custom element constructor inherits from the HTMLElement interface, and there is exactly one HTMLElement interface per Window object.

The customElements attribute of the Window interface must return the CustomElementRegistry object for that Window object.

interface CustomElementRegistry {
    [CEReactions]
    void          define(DOMString name,
                                           Function constructor,
                                           optional ElementDefinitionOptions options);
    any           get(DOMString name);
    Promise<void> whenDefined(DOMString name);
};

dictionary ElementDefinitionOptions {
    DOMString extends;
};
Every CustomElementRegistry has a set of custom element definitions, initially empty. In general, algorithms in this specification look up elements in the registry by any of name, local name, or constructor.

Every CustomElementRegistry also has an element definition is running flag which is used to prevent reentrant invocations of element definition. It is initially unset.

Every CustomElementRegistry also has a when-defined promise map, mapping valid custom element names to promises. It is used to implement the whenDefined() method.

NOTE
window . customElements . define(name, constructor)
Defines a new custom element, mapping the given name to the given constructor as an autonomous custom element.
window . customElements . define(name, constructor, { extends: baseLocalName })
Defines a new custom element, mapping the given name to the given constructor as a customized built-in element for the element type identified by the supplied baseLocalName. A "NotSupportedError" DOMException will be thrown upon trying to extend a custom element or an unknown element.
window . customElements . get(name)
Retrieves the custom element constructor defined for the given name. Returns undefined if there is no custom element definition with the given name.
window . customElements . whenDefined(name)
Returns a promise that will be fulfilled when a custom element becomes defined with the given name. (If such a custom element is already defined, the returned promise will be immediately fulfilled.) Returns a promise rejected with a "SyntaxError" DOMException if not given a valid custom element name.
Element definition is a process of adding a custom element definition to the CustomElementRegistry. This is accomplished by the define() method. When invoked, the define(name, constructor, options) method must run these steps:

If IsConstructor(constructor) is false, then throw a TypeError and abort these steps.

If name is not a valid custom element name, then throw a "SyntaxError" DOMException and abort these steps.

If this CustomElementRegistry contains an entry with name name, then throw a "NotSupportedError" DOMException and abort these steps.

If this CustomElementRegistry contains an entry with constructor constructor, then throw a "NotSupportedError" DOMException and abort these steps.

Let localName be name.

Let extends be the value of the extends member of options, or null if no such member exists.

If extends is not null, then:

If extends is a valid custom element name, then throw a "NotSupportedError" DOMException.

If the element interface for extends and the HTML namespace is HTMLUnknownElement (e.g., if extends does not indicate an element definition in this specification), then throw a "NotSupportedError" DOMException.

Set localName to extends.

If this CustomElementRegistry's element definition is running flag is set, then throw a "NotSupportedError" DOMException and abort these steps.

Set this CustomElementRegistry's element definition is running flag.

Run the following substeps while catching any exceptions:

Let prototype be Get(constructor, "prototype"). Rethrow any exceptions.

If Type(prototype) is not Object, then throw a TypeError exception.

Let lifecycleCallbacks be a map with the four keys "connectedCallback", "disconnectedCallback", "adoptedCallback", and "attributeChangedCallback", each of which belongs to an entry whose value is null.

For each of the four keys callbackName in lifecycleCallbacks, in the order listed in the previous step:

Let callbackValue be Get(prototype, callbackName). Rethrow any exceptions.

If callbackValue is not undefined, then set the value of the entry in lifecycleCallbacks with key callbackName to the result of converting callbackValue to the Web IDL Function callback type. Rethrow any exceptions from the conversion.

Let observedAttributes be an empty sequence<DOMString>.

If the value of the entry in lifecycleCallbacks with key "attributeChangedCallback" is not null, then:

Let observedAttributesIterable be Get(constructor, "observedAttributes"). Rethrow any exceptions.

If observedAttributesIterable is not undefined, then set observedAttributes to the result of converting observedAttributesIterable to a sequence<DOMString>. Rethrow any exceptions from the conversion.

Then, perform the following substep, regardless of whether the above steps threw an exception or not:

Unset this CustomElementRegistry's element definition is running flag.

Finally, if the first set of substeps threw an exception, then rethrow that exception, and terminate this algorithm. Otherwise, continue onward.

Let definition be a new custom element definition with name name, local name localName, constructor constructor, prototype prototype, observed attributes observedAttributes, and lifecycle callbacks lifecycleCallbacks.

Add definition to this CustomElementRegistry.

Let document be this CustomElementRegistry's relevant global object's associated Document.

Let upgrade candidates be all elements that are shadow-including descendants of document, whose namespace is the HTML namespace and whose local name is localName, in shadow-including tree order. Additionally, if extends is non-null, only include elements whose is value is equal to name.

For each element element in upgrade candidates, enqueue a custom element upgrade reaction given element and definition.

If this CustomElementRegistry's when-defined promise map contains an entry with key name:

Let promise be the value of that entry.

Resolve promise with undefined.

Delete the entry with key name from this CustomElementRegistry's when-defined promise map.

When invoked, the get(name) method must run these steps:

If this CustomElementRegistry contains an entry with name name, then return that entry's constructor.

Otherwise, return undefined.

When invoked, the whenDefined(name) method must run these steps:

If name is not a valid custom element name, then return a new promise rejected with a "SyntaxError" DOMException and abort these steps.

If this CustomElementRegistry contains an entry with name name, then return a new promise resolved with undefined and abort these steps.

Let map be this CustomElementRegistry's when-defined promise map.

If map does not contain an entry with key name, create an entry in map with key name and whose value is a new promise.

Let promise be the value of the entry in map with key name.

Return promise.

The whenDefined() method can be used to avoid performing an action until all appropriate custom elements are defined. In this example, we combine it with the :defined pseudo-class to hide a dynamically-loaded article's contents until we're sure that all of the autonomous custom elements it uses are defined.

articleContainer.hidden = true;

fetch(articleURL)
  .then(response => response.text())
  .then(text => {
    articleContainer.innerHTML = text;

    return Promise.all(
      [...articleContainer.querySelectorAll(":not(:defined)")]
        .map(el => customElements.whenDefined(el.localName))
    );
  })
  .then(() => {
    articleContainer.hidden = false;
  });
2.5 Upgrades

To upgrade an element, given as input a custom element definition definition and an element element, run the following steps:

If element is custom, abort these steps.

This can occur due to reentrant invocation of this algorithm, as in the following example:

<!DOCTYPE html>
<x-foo id="a"></x-foo>
<x-foo id="b"></x-foo>

<script>
// Defining enqueues upgrade reactions for both "a" and "b"
customElements.define("x-foo", class extends HTMLElement {
  constructor() {
    super();

    const b = document.querySelector("#b");
    b.remove();

    // While this constructor is running for "a", "b" is still
    // undefined, and so inserting it into the document will enqueue a
    // second upgrade reaction for "b" in addition to the one enqueued
    // by defining x-foo.
    document.body.appendChild(b);
  }
})
</script>
This step will thus bail out the algorithm early when upgrade an element is invoked with "b" a second time.

If element's custom element state is "failed", then abort these steps.

For each attribute in element's attribute list, in order, enqueue a custom element callback reaction with element, callback name "attributeChangedCallback", and an argument list containing attribute's local name, null, attribute's value, and attribute's namespace.

If element is connected, then enqueue a custom element callback reaction with element, callback name "connectedCallback", and an empty argument list.

Add element to the end of definition's construction stack.

Let C be definition's constructor.

Let constructResult be Construct(C).

NOTE
If C non-conformantly uses an API decorated with the [CEReactions] extended attribute, then the reactions enqueued at the beginning of this algorithm will execute during this step, before C finishes and control returns to this algorithm. Otherwise, they will execute after C and the rest of the upgrade process finishes.

Remove the last entry from the end of definition's construction stack.

NOTE
Assuming C calls super() (as it will if it is conformant), and that the call succeeds, this will be the already constructed marker that replaced the element we pushed at the beginning of this algorithm. (The HTML element constructor carries out this replacement.)

If C does not call super() (i.e. it is not conformant), or if any step in the HTML element constructor throws, then this entry will still be element.

If constructResult is an abrupt completion, then:

Set element's custom element state to "failed".

Return constructResult (i.e., rethrow the exception), and terminate these steps.

If SameValue(constructResult.[[value]], element) is false, then throw an "InvalidStateError" DOMException and terminate these steps.

NOTE
This can occur if C constructs another instance of the same custom element before calling super(), or if C uses JavaScript's return-override feature to return an arbitrary object from the constructor.

Set element's custom element state to "custom".

Set element's custom element definition to definition.

To try to upgrade an element, given as input an element element, run the following steps:

Let definition be the result of looking up a custom element definition given element's node document, element's namespace, element's local name, and element's is value.

If definition is not null, then enqueue a custom element upgrade reaction given element and definition.

2.6 Custom element reactions

A custom element possesses the ability to respond to certain occurrences by running author code:

When upgraded, its constructor is run.

When it becomes connected, its connectedCallback is run.

When it becomes disconnected, its disconnectedCallback is run.

When it is adopted into a new document, its adoptedCallback is run.

When any of its attributes are changed, appended, removed, or replaced, its attributeChangedCallback is run.

We call these reactions collectively custom element reactions.

The way in which custom element reactions are invoked is done with special care, to avoid running author code during the middle of delicate operations. Effectively, they are delayed until "just before returning to user script". This means that for most purposes they appear to execute synchronously, but in the case of complicated composite operations (like cloning, or range manipulation), they will instead be delayed until after all the relevant user agent processing steps have completed, and then run together as a batch.

Additionally, the precise ordering of these reactions is managed via a somewhat-complicated stack-of-queues system, described below. The intention behind this system is to guarantee that custom element reactions always are invoked in the same order as their triggering actions, at least within the local context of a single custom element. (Because custom element reaction code can perform its own mutations, it is not possible to give a global ordering guarantee across multiple elements.)

Each unit of related similar-origin browsing contexts has a custom element reactions stack, which is initially empty. The current element queue is the element queue at the top of the custom element reactions stack. Each item in the stack is an element queue, which is initially empty as well. Each item in an element queue is an element. (The elements are not necessarily custom yet, since this queue is used for upgrades as well.)

Each custom element reactions stack has an associated backup element queue, which an initially-empty element queue. Elements are pushed onto the backup element queue during operations that affect the DOM without going through an API decorated with [CEReactions], or through the parser's create an element for the token algorithm. An example of this is a user-initiated editing operation which modifies the descendants or attributes of an editable element. To prevent reentrancy when processing the backup element queue, each custom element reactions stack also has a processing the backup element queue flag, initially unset.

All elements have an associated custom element reaction queue, initially empty. Each item in the custom element reaction queue is of one of two types:

An upgrade reaction, which will upgrade the custom element and contains a custom element definition; or

A callback reaction, which will call a lifecycle callback, and contains a callback function as well as a list of arguments.

This is all summarised in the following schematic diagram:

A custom element reactions stack consists of a stack of element queues. Zooming in on a particular queue, we see that it contains a number of elements (in our example, <x-a>, then <x-b>, then <x-c>). Any particular element in the queue then has a custom element reaction queue. Zooming in on the custom element reaction queue, we see that it contains a variety of queued-up reactions (in our example, upgrade, then attribute changed, then another attribute changed, then connected).

To enqueue an element on the appropriate element queue, given an element element, run the following steps:

If the custom element reactions stack is empty, then:

Add element to the backup element queue.

If the processing the backup element queue flag is set, abort this algorithm.

Set the processing the backup element queue flag.

Queue a microtask to perform the following steps:

Invoke custom element reactions in the backup element queue.

Unset the processing the backup element queue flag.

Otherwise, add element to the current element queue.

To enqueue a custom element callback reaction, given a custom element element, a callback name callbackName, and a list of arguments args, run the following steps:

Let definition be element's custom element definition.

Let callback be the value of the entry in definition's lifecycle callbacks with key callbackName.

If callback is null, then abort these steps.

If callbackName is "attributeChangedCallback", then:

Let attributeName be the first element of args.

If definition's observed attributes does not contain attributeName, then abort these steps.

Add a new callback reaction to element's custom element reaction queue, with callback function callback and arguments args.

Enqueue an element on the appropriate element queue given element.

To enqueue a custom element upgrade reaction, given an element element and custom element definition definition, run the following steps:

Add a new upgrade reaction to element's custom element reaction queue, with custom element definition definition.

Enqueue an element on the appropriate element queue given element.

To invoke custom element reactions in an element queue queue, run the following steps:

For each custom element element in queue:

Let reactions be element's custom element reaction queue.

Repeat until reactions is empty:

Remove the first element of reactions, and let reaction be that element. Switch on reaction's type:

 upgrade reaction
Upgrade element using reaction's custom element definition.
 callback reaction
Invoke reaction's callback function with reaction's arguments, and with element as the callback this value.
If this throws any exception, then report the exception.

To ensure custom element reactions are triggered appropriately, we introduce the [CEReactions] IDL extended attribute. It indicates that the relevant algorithm is to be supplemented with additional steps in order to appropriately track and invoke custom element reactions.

The [CEReactions] extended attribute must take no arguments, and must not appear on anything other than an operation, attribute, setter, or deleter. Additionally, it must not appear on readonly attributes, unless the readonly attribute is also annotated with [PutForwards].

Operations, attributes, setters, or deleters annotated with the [CEReactions] extended attribute must run the following steps surrounding the main algorithm specified for the operation, setter, deleter, or for the attribute's setter:

Before executing the algorithm's steps
Push a new element queue onto the custom element reactions stack.
After executing the algorithm's steps
Pop the element queue from the custom element reactions stack, and invoke custom element reactions in that queue.
NOTE
The intent behind this extended attribute is somewhat subtle. One way of accomplishing its goals would be to say that every operation, attribute, setter, and deleter on the platform should have these steps inserted, and to allow implementers to optimize away unnecessary cases (where no DOM mutation is possible that could cause custom element reactions to occur).

However, in practice this imprecision could lead to non-interoperable implementations of custom element reactions, as some implementations might forget to invoke these steps in some cases. Instead, we settled on the approach of explicitly annotating all relevant IDL constructs, as a way of ensuring interoperable behavior and helping implementations easily pinpoint all cases where these steps are necessary.

Any nonstandard APIs introduced by the user agent that could modify the DOM in such a way as to cause enqueuing a custom element callback reaction or enqueuing a custom element upgrade reaction, for example by modifying any attributes or child elements, must also be decorated with the [CEReactions] attribute.

NOTE
As of the time of this writing, the following nonstandard or not-yet-standardized APIs are known to fall into this category:

HTMLElement's outerText IDL attribute

HTMLInputElement's webkitdirectory and incremental IDL attributes

HTMLLinkElement's disabled and scope IDL attributes

ShadowRoot's innerHTML IDL attribute

3. HTML: HTML element constructors

To support the custom elements feature, all HTML elements have special constructor behavior. This is indicated via the [HTMLConstructor] IDL extended attribute. It indicates that the interface object for the given interface will have a specific behavior when called, as defined in detail below.

The [HTMLConstructor] extended attribute must take no arguments, and must not appear on anything other than an interface. It must appear only once on an interface, and the interface must not be annotated with the [Constructor] or [NoInterfaceObject] extended attributes. (However, the interface may be annotated with [NamedConstructor]; there is no conflict there.) It must not be used on a callback interface.

Interface objects for interfaces annotated with the [HTMLConstructor] extended attribute must run the following steps as the function body behavior for both [[Call]] and [[Construct]] invocations of the corresponding JavaScript function object. When invoked with [[Call]], the NewTarget value is undefined, and so the algorithm below will immediately throw. When invoked with [[Construct]], the [[Construct]] newTarget parameter provides the NewTarget value.

Let registry be the current global object's CustomElementRegistry object.

If NewTarget is equal to the active function object, then throw a TypeError and abort these steps.

This can occur when a custom element is defined using an element interface as its constructor:

customElements.define("bad-1", HTMLButtonElement);
new HTMLButtonElement();          // (1)
document.createElement("bad-1");  // (2)
In this case, during the execution of HTMLButtonElement (either explicitly, as in (1), or implicitly, as in (2)), both the active function object and NewTarget are HTMLButtonElement. If this check was not present, it would be possible to create an instance of HTMLButtonElement whose local name was bad-1.

Let definition be the entry in registry with constructor equal to NewTarget. If there is no such definition, then throw a TypeError and abort these steps.

NOTE
Since there can be no entry in registry with a constructor of undefined, this step also prevents HTML element constructors from being called as functions (since in that case NewTarget will be undefined).

If definition's local name is equal to definition's name (i.e., definition is for an autonomous custom element), then:

If the active function object is not HTMLElement, then throw a TypeError and abort these steps.

This can occur when a custom element is defined to not extend any local names, but inherits from a non-HTMLElement class:

customElements.define("bad-2", class Bad2 extends HTMLParagraphElement {});
In this case, during the (implicit) super() call that occurs when constructing an instance of Bad2, the active function object is HTMLParagraphElement, not HTMLElement.

Otherwise (i.e., if definition is for a customized built-in element):

Let valid local names be the list of local names for elements defined in this specification or in other applicable specifications that use the active function object as their element interface.

If valid local names does not contain definition's local name, then throw a TypeError and abort these steps.

This can occur when a custom element is defined to extend a given local name but inherits from the wrong class:

customElements.define("bad-3", class Bad3 extends HTMLQuoteElement {}, { extends: "p" });
In this case, during the (implicit) super() call that occurs when constructing an instance of Bad3, valid local names is the list containing q and blockquote, but definition's local name is p, which is not in that list.

Let prototype be definition's prototype.

If definition's construction stack is empty, then:

Let element be a new element that implements the interface to which the active function object corresponds, with no attributes, namespace set to the HTML namespace, local name set to definition's local name, and node document set to the current global object's associated Document.

Perform element.[[SetPrototypeOf]](prototype). Rethrow any exceptions.

Set element's custom element state to "custom".

Set element's custom element definition to definition.

Return element.

NOTE
This occurs when author script constructs a new custom element directly, e.g. via new MyCustomElement().

Let element be the last entry in definition's construction stack.

If element is an already constructed marker, then throw an "InvalidStateError" DOMException and abort these steps.

This can occur when the author code inside the custom element constructor non-conformantly creates another instance of the class being constructed, before calling super():

let doSillyThing = false;

class DontDoThis extends HTMLElement {
  constructor() {
    if (doSillyThing) {
      doSillyThing = false;
      new DontDoThis();
      // Now the construction stack will contain an already constructed marker.
    }

    // This will then fail with an "InvalidStateError" DOMException:
    super();
  }
}
This can also occur when author code inside the custom element constructor non-conformantly calls super() twice, since per the JavaScript specification, this actually executes the superclass constructor (i.e. this algorithm) twice, before throwing an error:

class DontDoThisEither extends HTMLElement {
  constructor() {
    super();

    // This will throw, but not until it has already called into the HTMLElement constructor
    super();
  }
}
Perform element.[[SetPrototypeOf]](prototype). Rethrow any exceptions.

Replace the last entry in definition's construction stack with an already constructed marker.

Return element.

NOTE
This step is normally reached when upgrading a custom element; the existing element is returned, so that the super() call inside the custom element constructor assigns that existing element to this.

In addition to the constructor behavior implied by [HTMLConstructor], some elements also have named constructors (which are really factory functions with a modified prototype property).

Named constructors for HTML elements can also be used in an extends clause when defining a custom element constructor:

class AutoEmbiggenedImage extends Image {
  constructor(width, height) {
    super(width * 10, height * 10);
  }
}

customElements.define("auto-embiggened", AutoEmbiggenedImage, { extends: "img" });

const image = new AutoEmbiggenedImage(15, 20);
console.assert(image.width === 150);
console.assert(image.height === 200);
4. Miscellaneous patches

4.1 HTML: The Window object

HTML's Window object definition must be extended as follows:

partial interface Window {
    readonly attribute CustomElementRegistry customElements;
};
4.2 HTML: Pseudo-classes

:defined
The :defined pseudo-class must match any element that is defined.

4.3 HTML: Creating and inserting nodes

When the HTML parser requires the UA to create an element for a token in a particular given namespace and with a particular intended parent, the UA must run the following steps:

Let document be intended parent's node document.

Let local name be the tag name of the token.

Let is be the value of the "is" attribute in the given token, if such an attribute exists, or null otherwise.

Let definition be the result of looking up a custom element definition given document, given namespace, local name, and is.

If definition is non-null and the parser was not originally created for the HTML fragment parsing algorithm, then let will execute script be true. Otherwise, let it be false.

If will execute script is true, then:

Increment document's throw-on-dynamic-markup-insertion counter.

If the JavaScript execution context stack is empty, then perform a microtask checkpoint.

Push a new element queue onto the custom element reactions stack.

Let element be the result of creating an element given document, localName, given namespace, null, and is. If will execute script is true, set the synchronous custom elements flag; otherwise, leave it unset.

NOTE
This will cause custom element constructors to run, if will execute script is true. However, since we incremented the throw-on-dynamic-markup-insertion counter, this cannot cause new characters to be inserted into the tokenizer, or the document to be blown away.

If this step throws an exception, then report the exception, and let element be instead a new element that implements HTMLUnknownElement, with no attributes, namespace set to given namespace, namespace prefix set to null, custom element state set to "failed", custom element definition set to null, and node document set to document.

Append each attribute in the given token to element.

NOTE
This can enqueue a custom element callback reaction for the attributeChangedCallback, which might run immediately (in the next step).

NOTE
Even though the is attribute governs the creation of a customized built-in element, it is not present during the execution of the relevant custom element constructor; it is appended in this step, along with all other attributes.

If will execute script is true, then:

Let queue be the result of popping the current element queue from the custom element reactions stack. (This will be the same element queue as was pushed above.)

Invoke custom element reactions in queue.

Decrement document's throw-on-dynamic-markup-insertion counter.

If element has an xmlns attribute in the XMLNS namespace whose value is not exactly the same as the element's namespace, that is a parse error. Similarly, if element has an xmlns:xlink attribute in the XMLNS namespace whose value is not the XLink Namespace, that is a parse error.

If element is a resettable element, invoke its reset algorithm. (This initialises the element's value and checkedness based on the element's attributes.)

If element is a form-associated element, and the form element pointer is not null, and there is no template element on the stack of open elements, and element is either not listed or doesn't have a form attribute, and the intended parent is in the same tree as the element pointed to by the form element pointer, associate element with the form element pointed to by the form element pointer, and suppress the running of the reset the form owner algorithm when the parser subsequently attempts to insert the element.

Return element.

4.4 HTML: Parsing XHTML documents

When creating DOM nodes representing elements, the create an element for a token algorithm or some equivalent that operates on appropriate XML datastructures must be used, to ensure the proper element interfaces are created and that custom elements are set up correctly.

4.5 HTML: Content model

HTML has several sections that need to be updated when introducing a new element, or in this case class of elements. The necessary changes are:

The categories venn diagram's interactive list must include autonomous custom elements in phrasing and flow content.

Flow content must include autonomous custom elements
Phrasing content must include autonomous custom elements
Palpable content must include autonomous custom elements
The elements index must include a row at the bottom for autonomous custom elements
The element content categories index must include autonomous custom elements in the flow content, phrasing content, and palpable content sections
Tag omission must note that p element end tags cannot be omitted if the element's parent is an autonomous custom element
4.6 HTML: Wide-ranging patches

All IDL attributes in HTML which could potentially cause DOM mutations have been updated to be annotated with the [CEReactions] extended attribute.

All HTML interfaces representing a HTML element have been updated to be annotated with the [HTMLConstructor] extended attribute.

All places in HTML that create elements have been updated to use the new create an element algorithm.

4.7 DOM: Elements

Elements have an associated namespace, namespace prefix, local name, custom element state, custom element definition, is value. When an element is created, all of these values are initialized.

An element’s custom element state is one of "undefined", "failed", "uncustomized", or "custom". An element whose custom element state is "uncustomized" or "custom" is said to be defined. An element whose custom element state is "custom" is said to be custom.

NOTE
Whether or not an element is defined is used to determine the behavior of the :defined pseudo-class. Whether or not an element is custom is used to determine the behavior of the mutation algorithms. The "failed" state is used to ensure that if a custom element constructor fails to execute correctly the first time, it is not executed again by an upgrade.

The following code illustrates elements in each of these four states:

<!DOCTYPE html>
<script>
  window.customElements.define("sw-rey", class extends HTMLElement {})
  window.customElements.define("sw-finn", class extends HTMLElement {}, { extends: "p" })
  window.customElements.define("sw-kylo", class extends HTMLElement {
    constructor() {
      // super() intentionally omitted for this example
    }
  })
</script>

<!-- "undefined" (not defined, not custom) -->
<sw-han></sw-han>
<p is="sw-luke"></p>
<p is="asdf"></p>

<!-- "failed" (not defined, not custom) -->
<sw-kylo></sw-kylo>

<!-- "uncustomized" (defined, not custom) -->
<p></p>
<asdf></asdf>

<!-- "custom" (defined, custom) -->
<sw-rey></sw-rey>
<p is="sw-finn"></p>
To create an element, given a document, localName, namespace, and optional prefix, is, and synchronous custom elements flag, run these steps:

If prefix was not given, let prefix be null.

If is was not given, let is be null.

Let result be null.

Let definition be the result of looking up a custom element definition given document, namespace, localName, and is.

If definition is non-null, and definition’s name is not equal to its local name (i.e., definition represents a customized built-in element), then:

Let interface be the element interface for localName and the HTML namespace.

Set result to a new element that implements interface, with no attributes, namespace set to the HTML namespace, namespace prefix set to prefix, local name set to localName, custom element state set to "undefined", custom element definition set to null, is value set to is, and node document set to document.

If the synchronous custom elements flag is set, upgrade element using definition.

Otherwise, enqueue a custom element upgrade reaction given result and definition.

Otherwise, if definition is non-null, then:

If the synchronous custom elements flag is set:

Let C be definition’s constructor.

Set result to Construct(C). Rethrow any exceptions.

If result does not implement the HTMLElement interface, throw a TypeError.

NOTE
This is meant to be a brand check to ensure that the object was allocated by the a HTML element constructor. See webidl #97 about making this more precise.

If this check passes, then result will already have its custom element state and custom element definition initialized.

If result’s attribute list is not empty, then throw a NotSupportedError.

If result has children, then throw a NotSupportedError.

If result’s parent is not null, then throw a NotSupportedError.

If result’s node document is not document, then throw a NotSupportedError.

If result’s namespace is not the HTML namespace, then throw a NotSupportedError.

NOTE
As of the time of this writing, every element that implements the HTMLElement interface is also in the HTML namespace, so this check is currently redundant with the above brand check. However, this is not guaranteed to be true forever in the face of potential specification changes, such as converging certain SVG and HTML interfaces.

If result’s local name is not equal to localName, then throw a NotSupportedError.

Set result’s namespace prefix to prefix.

Set result’s is value to null.

Otherwise:

Set result to a new element that implements the HTMLElement interface, with no attributes, namespace set to the HTML namespace, namespace prefix set to prefix, local name set to localName, custom element state set to "undefined", custom element definition set to null, is value set to null, and node document set to document.

Enqueue a custom element upgrade reaction given result and definition.

Otherwise:

Let interface be the element interface for localName and namespace.

Set result to a new element that implements interface, with no attributes, namespace set to namespace, namespace prefix set to prefix, local name set to localName, custom element state set to "uncustomized", custom element definition set to null, is value set to is, and node document set to document.

If namespace is the HTML namespace, and either localName is a valid custom element name or is is non-null, then set result’s custom element state to "undefined".

Return result.

To change an attribute attribute from an element element to value, run these steps:

Queue a mutation record of "attributes" for element with name attribute’s local name, namespace attribute’s namespace, and oldValue attribute’s value.
If element is custom, then enqueue a custom element callback reaction with element, callback name "attributeChangedCallback", and an argument list containing attribute’s local name, attribute’s value, value, and attribute’s namespace.
Run the attribute change steps with element, attribute’s local name, attribute’s value, value, and attribute’s namespace.

Set attribute’s value to value.
To append an attribute attribute to an element element, run these steps:

Queue a mutation record of "attributes" for element with name attribute’s local name, namespace attribute’s namespace, and oldValue null.
If element is custom, then enqueue a custom element callback reaction with element, callback name "attributeChangedCallback", and an argument list containing attribute’s local name, null, attribute’s value, and attribute’s namespace.
Run the attribute change steps with element, attribute’s local name, null, attribute’s value, and attribute’s namespace.

Append the attribute to the element’s attribute list.
Set attribute’s element to element.
To remove an attribute attribute from an element element, run these steps:

Queue a mutation record of "attributes" for element with name attribute’s local name, namespace attribute’s namespace, and oldValue attribute’s value.
If element is custom, then enqueue a custom element callback reaction with element, callback name "attributeChangedCallback", and an argument list containing attribute’s local name, attribute’s value, null, and attribute’s namespace.
Run the attribute change steps with element, attribute’s local name, attribute’s value, null, and attribute’s namespace.

Remove attribute from the element’s attribute list.
Set attribute’s element to null.
To replace an attribute oldAttr by an attribute newAttr in an element element, run these steps:

Queue a mutation record of "attributes" for element with name oldAttr’s local name, namespace oldAttr’s namespace, and oldValue oldAttr’s value.

If element is custom, then enqueue a custom element callback reaction with element, callback name "attributeChangedCallback", and an argument list containing oldAttr’s local name, oldAttr’s value, newAttr’s value, and oldAttr’s namespace.
Run the attribute change steps with element, oldAttr’s local name, oldAttr’s value, newAttr’s value, and oldAttr’s namespace.

Replace oldAttr by newAttr in the element’s attribute list.

Set oldAttr’s element to null.

Set newAttr’s element to element.

4.8 DOM: Cloning

To clone a node, with an optional document and clone children flag, run these steps:

If document is not given, let document be node’s node document.

If node is an element, then:

Let copy be the result of creating an element, given document, node’s local name, node’s namespace, node’s namespace prefix, and the value of node’s is attribute if present (or null if not). The synchronous custom elements flag should be unset.

For each attribute in node’s attribute list, in order, run these substeps:

Let copyAttribute be a clone of attribute.

Append copyAttribute to copy.

Otherwise, let copy be a node that implements the same interfaces as node, and fulfills these additional requirements, switching on node:

Document
Set copy’s encoding, content type, URL, type, and mode, to those of node.

DocumentType
Set copy’s name, public ID, and system ID, to those of node.

Attr
Set copy’s namespace, namespace prefix, local name, and value, to those of node.

Text
Comment
Set copy’s data, to that of node.
ProcessingInstruction
Set copy’s target and data to those of node.
Any other node
—
Set copy’s node document and document to copy, if copy is a document, and set copy’s node document to document otherwise.

Run any cloning steps defined for node in other applicable specifications and pass copy, node, document and the clone children flag if set, as parameters.
If the clone children flag is set, clone all the children of node and append them to copy, with document as specified and the clone children flag being set.
Return copy.
4.9 DOM: Mutation algorithms

To insert a node into a parent before a child, with an optional suppress observers flag, run these steps:

Let count be the number of children of node if it is a DocumentFragment node, and one otherwise.
If child is non-null, run these substeps:
For each range whose start node is parent and start offset is greater than child’s index, increase its start offset by count.
For each range whose end node is parent and end offset is greater than child’s index, increase its end offset by count.
Let nodes be node’s children if node is a DocumentFragment node, and a list containing solely node otherwise.
If node is a DocumentFragment node, remove its children with the suppress observers flag set.
If node is a DocumentFragment node, queue a mutation record of "childList" for node with removedNodes nodes.
NOTE
This step intentionally does not pay attention to the suppress observers flag.

For each node in nodes, in tree order, run these substeps:

Insert node into parent before child or at the end of parent if child is null.

If parent is a shadow host and node is a slotable, then assign a slot for node.

If parent is a slot whose assigned nodes is the empty list, then run signal a slot change for parent.

Run assign slotables for a tree with node’s tree and a set containing each inclusive descendant of node that is a slot.

For each shadow-including inclusive descendant inclusiveDescendant of node, in shadow-including tree order, run these subsubsteps:

Run the insertion steps with inclusiveDescendant.

If inclusiveDescendant is connected, then:

If inclusiveDescendant is custom, then enqueue a custom element callback reaction with inclusiveDescendant, callback name "connectedCallback", and an empty argument list.

Otherwise, try to upgrade inclusiveDescendant.

NOTE
If this successfully upgrades inclusiveDescendant, its connectedCallback will be enqueued automatically during the upgrade an element algorithm.

If suppress observers flag is unset, queue a mutation record of "childList" for parent with addedNodes nodes, nextSibling child, and previousSibling child’s previous sibling or parent’s last child if child is null.
To remove a node from a parent, with an optional suppress observers flag, run these steps:

Let index be node’s index.
For each range whose start node is an inclusive descendant of node, set its start to (parent, index).
For each range whose end node is an inclusive descendant of node, set its end to (parent, index).
For each range whose start node is parent and start offset is greater than index, decrease its start offset by one.
For each range whose end node is parent and end offset is greater than index, decrease its end offset by one.
For each NodeIterator object iterator whose root’s node document is node’s node document, run the NodeIterator pre-removing steps given node and iterator.

Let oldPreviousSibling be node’s previous sibling.
Let oldNextSibling be node’s next sibling.
Remove node from its parent.
If node is assigned, then run assign slotables for node’s assigned slot.

If parent is a slot whose assigned nodes is the empty list, then run signal a slot change for parent.

If node has an inclusive descendant that is a slot, then:

Run assign slotables for a tree with parent’s tree.

Run assign slotables for a tree with node’s tree and a set containing each inclusive descendant of node that is a slot.

Run the removing steps with node and parent.

If node is custom, then enqueue a custom element callback reaction with node, callback name "disconnectedCallback", and an empty argument list.

NOTE
It is intentional for now that custom elements do not get parent passed. This might change in the future if there is a need.

For each shadow-including descendant descendant of node, in shadow-including tree order, run these substeps:

Run the removing steps with descendant.

If descendant is custom, then enqueue a custom element callback reaction with descendant, callback name "disconnectedCallback", and an empty argument list.

For each inclusive ancestor inclusiveAncestor of parent, if inclusiveAncestor has any registered observers whose options' subtree is true, then for each such registered observer registered, append a transient registered observer whose observer and options are identical to those of registered and source which is registered to node’s list of registered observers.
If suppress observers flag is unset, queue a mutation record of "childList" for parent with removedNodes a list solely containing node, nextSibling oldNextSibling, and previousSibling oldPreviousSibling.
4.10 DOM: Wide-ranging patches

All IDL attributes in DOM which could potentially cause DOM mutations have been updated to be annotated with the [CEReactions] extended attribute.

All places in DOM that create elements have been updated to use the new create an element algorithm. At the time of this writing, apart from the above createElement() and createElementNS() definitions, only createHTMLDocument() creates elements.


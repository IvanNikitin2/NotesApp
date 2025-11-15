// This utility manages saving and restoring the caret position in a contentEditable div.

let savedOffset = 0;

function getCaretOffset(element: Node): number {
  let offset = 0;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    offset = preCaretRange.toString().length;
  }
  return offset;
}

function setCaretOffset(element: Node, offset: number) {
  const range = document.createRange();
  const selection = window.getSelection();
  let charCount = 0;
  
  function findNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textLength = node.textContent?.length || 0;
      if (charCount + textLength >= offset) {
        range.setStart(node, offset - charCount);
        return true;
      }
      charCount += textLength;
    } else {
      for (const child of Array.from(node.childNodes)) {
        if (findNode(child)) {
          return true;
        }
      }
    }
    return false;
  }

  findNode(element);
  range.collapse(true);
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// Before a re-render, we save the current caret position.
// We attach this to the 'input' event listener on the editable div.
document.addEventListener('input', (e) => {
  if ((e.target as HTMLElement).isContentEditable) {
    savedOffset = getCaretOffset(e.target as Node);
  }
});

// After a re-render, we restore the caret position.
// This function is called from a useEffect hook in the React component.
export function setCaret(element: HTMLElement) {
  // Add a slight delay to ensure the DOM is fully updated after the render.
  setTimeout(() => setCaretOffset(element, savedOffset), 0);
}
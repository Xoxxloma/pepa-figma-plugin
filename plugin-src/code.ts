// @ts-nocheck
import {createUrlSearchParams} from "../ui-src/Utils";

figma.showUI(__html__, { themeColors: true, height: 480, width: 400 });

function between(min, max) {
  return Math.floor(
      Math.random() * (max - min) + min
  )
}

figma.on('selectionchange', () => {
  figma.ui.postMessage({type: 'selection-change', count: figma.currentPage.selection.length })
})

figma.on('drop', async (event) => {
  if (!figma.currentPage.selection.length) {
    figma.notify("Please select at least one node to fill", { error: true })
    return
  }
  const { files, dropMetadata } = event;
  let idx = 0
  logEvent('DROP')
  for (const node of figma.currentPage.selection) {
    const fileIdx = files[idx] ? idx : between(0, files.length - 1);
    const buff = await files[fileIdx].getBytesAsync();
    const image = figma.createImage(new Uint8Array(buff))
    if ("fills" in node) {
      node.fills = [
        {
          type: 'IMAGE',
          imageHash: image.hash,
          scaleMode: 'FILL'
        }
      ]
    } else {
      figma.notify("Cannot fill this element", { error: true })
    }
    idx++
  }
})

figma.ui.onmessage = async msg => {
  if (msg.type === 'check-selections') {
    figma.ui.postMessage({type: 'selection-change', count: figma.currentPage.selection.length })
  }

  if (msg.type === 'create-pictures') {
    logEvent('CREATE_PICTURES', msg.state.selectedCategory.name)
    await withSaveClose(async () => createRandomImages(msg.state))
  }

  if (msg.type === 'fill') {
    logEvent('FILL', msg.category.name)
    await withSaveClose(async () => fillNodes(msg.category))
  }

};

async function fillNodes (category) {
  for (const node of figma.currentPage.selection) {
    const picResp = await fetchPicture(category.id)
    const buff = await picResp.arrayBuffer()
    const image = figma.createImage(new Uint8Array(buff))
    if ("fills" in node) {
      node.fills = [
        {
          type: 'IMAGE',
          imageHash: image.hash,
          scaleMode: 'FILL'
        }
      ]
    } else {
      figma.notify("Cannot fill this element", { error: true })
    }
  }
  // figma.closePlugin();
}
interface IState {
  count: number;
  width: number;
  height: number;
  selectedCategory: { id: string; name: string }
  gap: number;
  columns: number;
}
async function createRandomImages (state: IState) {
  const { height, width, count, columns, selectedCategory, gap} = state
  let currY = 0;
  let currX = 0

  const nodes: SceneNode[] = Array(count).fill(null).map((_, i) => {
    const node = figma.createRectangle()
    node.resize(width, height)
    node.x = currX;
    node.y = currY;
    const isLastIdxInRow = (i + 1) % columns === 0
    currX = isLastIdxInRow ? 0 : currX + width + gap
    currY = isLastIdxInRow ? currY + height + gap : currY

    return node
  })

  const promises = nodes.map(async (node) => {
    const picResp = await fetchPicture(selectedCategory.id)
    const buff = await picResp.arrayBuffer()
    const image = figma.createImage(new Uint8Array(buff))
    node.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' }]
  })
  await Promise.all(promises)

  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
  // figma.closePlugin();
}

async function withSaveClose (cb: () => Promise<void>) {
  try {
    await cb()
  } catch (e) {
    console.log(e, 'ERROR')
    figma.notify('Error!', {
      error: true,
      button: { text: 'Try again!', action: () =>  figma.showUI(__html__, { visible: true })},
      onDequeue: (reason) => {
        if (reason === 'dismiss' || reason === 'timeout') {
          figma.closePlugin();
        }
      }
    })
  } finally {
    figma.ui.postMessage({type: 'operation-finished', count: figma.currentPage.selection.length})
  }
}

async function fetchPicture (categoryId) {
  return fetch('https://pepavpn.ru:4006/getPicture' + createUrlSearchParams({ category: categoryId }))
}

async function logEvent(event, category = 'empty') {
  const user = figma.currentUser
  try {
    await fetch(`https://pepavpn.ru:4006/log?event=${event}&user=${user.id}&category=${category}`)
  } catch (e) {
  }
}

// const seconds = figma.payments.getUserFirstRanSecondsAgo()
// await figma.payments.initiateCheckoutAsync({
//   interstitial: "PAID_FEATURE"
// })

// @ts-nocheck
import {createUrlSearchParams} from "../ui-src/Utils";

figma.showUI(__html__, { themeColors: true, height: 265, width: 365 });

function between(min, max) {
  return Math.floor(
      Math.random() * (max - min) + min
  )
}

figma.on('drop', async (event) => {
  const { files, dropMetadata } = event;
  let idx = 0
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
  if (msg.type === 'create-pictures') {

    await withSaveClose(async () => createRandomImages(msg.state))
  }

  if (msg.type === 'fill') {
    console.log(msg, 'msg')
    await withSaveClose(async () => fillNodes(msg.category))
  }

  if (msg.type === 'drop-files') {
    console.log(msg.files, 'files')
  }
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
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
}
async function createRandomImages (state: IState) {
  const nodes: SceneNode[] = [];
  const promises = Array.from(Array(state.count).keys()).map(async(_, i) => {
    const picResp = await fetchPicture(state.selectedCategory.id)
    // const picResp = await fetch('http://localhost:9000/getPicture' + createUrlSearchParams({
    //   category: state.selectedCategory.id,
    // }))
    const buff = await picResp.arrayBuffer()
    const image = figma.createImage(new Uint8Array(buff))
    const node = figma.createRectangle()

    node.resize(state.width, state.height)
    node.x = (i * state.width + 30);
    node.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' }]
    nodes.push(node)
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
  }
}

async function fetchPicture (categoryId) {
  return fetch('http://localhost:9000/getPicture' + createUrlSearchParams({ category: categoryId }))
}

// const seconds = figma.payments.getUserFirstRanSecondsAgo()
// await figma.payments.initiateCheckoutAsync({
//   interstitial: "PAID_FEATURE"
// })

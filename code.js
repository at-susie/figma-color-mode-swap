"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI((__html__), { width: 400, title: "COLOR MODE CHANGER" });
const localPaintStyles = figma.getLocalPaintStyles();
const localEffectStyles = figma.getLocalEffectStyles();
function applyStyleToLayer(layer, styleType, styleProperty) {
    const stylePrefix = styleType === 'light' ? 'dark/' : 'light/';
    if (layer[styleProperty]) {
        const localStyle = styleProperty === 'effectStyleId'
            ? figma.getStyleById(layer[styleProperty])
            : figma.getLocalPaintStyles().find(s => s.id === layer[styleProperty]);
        if (localStyle) {
            const localStyleName = localStyle.name;
            if (localStyleName.startsWith(stylePrefix)) {
                const colorName = localStyleName.substring(stylePrefix.length);
                const styleName = `${styleType}/${colorName}`;
                const style = styleProperty === 'effectStyleId'
                    ? localEffectStyles.find(s => s.name === styleName)
                    : localPaintStyles.find(s => s.name === styleName);
                if (style) {
                    //figma.notify("Styles have been changed 🎉");
                    layer[styleProperty] = style.id;
                    figma.notify("Styles have been swapped 🎉", { timeout: 1 });
                }
            }
        }
    }
}
function applyStylesToLayers(layers, styleType) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const layer of layers) {
            if (layer.type === 'FRAME' || layer.type === 'GROUP' || layer.type === 'INSTANCE' || layer.type === 'COMPONENT' || layer.type === 'COMPONENT_SET') {
                yield applyStylesToLayers(layer.children, styleType);
            }
            applyStyleToLayer(layer, styleType, 'fillStyleId');
            applyStyleToLayer(layer, styleType, 'strokeStyleId');
            applyStyleToLayer(layer, styleType, 'effectStyleId');
        }
    });
}
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const selection = figma.currentPage.selection;
    if (msg.type === 'changeStylesDark') {
        //loadingDiv.style.display = 'block'; // show the loading animation
        figma.ui.postMessage({ pluginMessageTest: "Hello from plugin!" });
        yield applyStylesToLayers(selection, 'dark');
        console.log('Dark button clicked');
        //loadingDiv.style.display = 'none';
        figma.closePlugin();
    }
    else if (msg.type === 'changeStylesLight') {
        //loadingDiv.style.display = 'block'; // show the loading animation
        yield applyStylesToLayers(selection, 'light');
        console.log('Light button clicked');
        //loadingDiv.style.display = 'none';
        figma.closePlugin();
    }
});

figma.showUI(__html__);

const localPaintStyles = figma.getLocalPaintStyles();

async function applyStylesToLayers(layers, styleType) {
  for (const layer of layers) {
    // Check if the layer is a frame or group
    if (layer.type === 'FRAME' || layer.type === 'GROUP') {
      // Recursively call applyStylesToLayers on the child layers
      await applyStylesToLayers(layer.children, styleType);
      
      // Check if the frame has a fill style applied
      if (layer.fills.length > 0) {
        const fillStyle = layer.fills[0].paintStyleId
          ? figma.getStyleById(layer.fills[0].paintStyleId)
          : null;
        const fillStyleName = fillStyle ? fillStyle.name : null;

        // Check if the fill style name matches the given style type
        const stylePrefix = styleType === 'light' ? 'dark/' : 'light/';
        if (fillStyleName && fillStyleName.startsWith(stylePrefix)) {
          // Get the color name from the fill style name
          const colorName = fillStyleName.substring(stylePrefix.length);

          // Check if a corresponding style exists
          const styleName = `${styleType}/${colorName}`;
          const style = localPaintStyles.find(s => s.name === styleName);

          if (style) {
            // Apply the style to the frame's fill
            layer.fills = [{type: 'PAINT', paintStyleId: style.id}];
          }
        }
      }
      
      // Check if the frame has a stroke style applied
      if (layer.strokes.length > 0) {
        const strokeStyle = layer.strokes[0].paintStyleId
          ? figma.getStyleById(layer.strokes[0].paintStyleId)
          : null;
        const strokeStyleName = strokeStyle ? strokeStyle.name : null;

        // Check if the stroke style name matches the given style type
        const stylePrefix = styleType === 'light' ? 'dark/' : 'light/';
        if (strokeStyleName && strokeStyleName.startsWith(stylePrefix)) {
          // Get the color name from the stroke style name
          const colorName = strokeStyleName.substring(stylePrefix.length);

          // Check if a corresponding style exists
          const styleName = `${styleType}/${colorName}`;
          const style = localPaintStyles.find(s => s.name === styleName);

          if (style) {
            // Apply the style to the frame's stroke
            layer.strokes = [{type: 'PAINT', paintStyleId: style.id}];
          }
        }
      }
      
    } else {
      // Check if the layer has a local style applied
      if (layer.fillStyleId) {
        // Get the name of the local style applied to the layer
        const localStyle = figma.getStyleById(layer.fillStyleId);
        if (localStyle) {
          const localStyleName = localStyle.name;

          // Check if the local style name matches the given style type
          const stylePrefix = styleType === 'light' ? 'dark/' : 'light/';
          if (localStyleName.startsWith(stylePrefix)) {
            // Get the color name from the local style name
            const colorName = localStyleName.substring(stylePrefix.length);

            // Check if a corresponding style exists
            const styleName = `${styleType}/${colorName}`;
            const style = localPaintStyles.find(s => s.name === styleName);

            if (style) {
              // Apply the style to the layer
              layer.fillStyleId = style.id;
            }
          }
        }
      }

      if (layer.strokeStyleId) {
        // Get the name of the local style applied to the layer
        const localStrokeStyle = figma.getStyleById(layer.strokeStyleId);
        if (localStrokeStyle) {
          const localStrokeStyleName = localStrokeStyle.name;

          // Check if the local style name matches the given style type
          const stylePrefix = styleType === 'light' ? 'dark/' : 'light/';
          if (localStrokeStyleName.startsWith(stylePrefix)) {
            // Get the color name from the local style name
            const colorName = localStrokeStyleName.substring(stylePrefix.length);

            // Check if a corresponding style exists
            const styleName = `${styleType}/${colorName}`;
            const style = localPaintStyles.find(s => s.name === styleName);

            if (style) {
              // Apply the style to the layer
              layer.strokeStyleId = style.id;
            }
          }
        }
      }
    }
  }
}


figma.ui.onmessage = async (msg) => {
  const selection = figma.currentPage.selection;

  if (msg.type === 'changeStylesDark') {
    await applyStylesToLayers(selection, 'dark');
    console.log('Dark button clicked!!');
    figma.closePlugin();
  } else if (msg.type === 'changeStylesLight') {
    await applyStylesToLayers(selection, 'light');
    console.log('Light button clicked!!');
    figma.closePlugin();
  
  }
  
}
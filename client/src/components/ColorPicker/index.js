import React, { useState } from "react";
import { BlockPicker } from "react-color";

export default function ColorPicker({ color, setColor, type }) {
	const initialColor = color[type];
	const handleChange = (e) => {
		setColor({ ...color, [type]: e.hex });
	};
	const onComplete = (e) => {
		setColor({ ...color, [type]: e.hex });
	};

	return (
		<BlockPicker
			width="100"
			triangle="hide"
			color={initialColor}
			onChange={handleChange}
			onChangeComplete={onComplete}
		/>
	);
}

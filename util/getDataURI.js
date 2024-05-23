const getDataURI = file => {
	const base64String = Buffer.from(file.buffer).toString("base64");
	let dataURI = `data:${file.mimetype};base64,${base64String}`;

  return dataURI;
};

module.exports = getDataURI
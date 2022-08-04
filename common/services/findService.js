const findService = async (models, skip, limit, searchKey, fields, popul) => {
    try {
        let data;

        if (searchKey) {
            const columns = [...fields.map((field) => {
                return { [field]: { $regex: searchKey } }
            })];
            data = await models.model.find({
                $and: [
                    { $or: columns }
                ]
            }).skip(skip).limit(limit);
            return data;

        } else {

            if (models.childModel) {
                let modelArr = [];
                const modelRef = popul.modelRef;
                const cursor = models.model.find()
                    .skip(skip)
                    .limit(limit)
                    .populate(popul.userPath, popul.userSelect).cursor();

                for (
                    let doc = await cursor.next();
                    doc != null;
                    doc = await cursor.next()
                ) {
                    const childData = await models.childModel.find({ modelRef: doc._id })
                        .select("numOfProduct")
                        .populate(popul.modelPath, popul.modelSelect)
                        console.log(childData);
                    const obj = { ...doc._doc,  childData};
                    modelArr.push(obj)
                }

                return modelArr;

            } else if (models.model && !models.childModel) {
                let modelArr = [];
                const modelRef = popul.modelRef;
                const cursor = models.model.find()
                    .skip(skip)
                    .limit(limit)
                    .populate(popul.userPath, popul.userSelect)
                    .populate(popul.prntModelRef, popul.modelSelect)
                    .populate(popul.prntModelRef2, popul.modelSelect2)
                    .cursor();
                for (
                    let doc = await cursor.next();
                    doc != null;
                    doc = await cursor.next()
                ) {
                    const obj = { ...doc._doc };
                    modelArr.push(obj)
                }
                return modelArr;

            } else {
                let modelArr = [];
                const cursor = models.model.find()
                    .skip(skip)
                    .limit(limit)
                    .populate(popul.userPath, popul.userSelect).cursor();
                for (
                    let doc = await cursor.next();
                    doc != null;
                    doc = await cursor.next()
                ) {
                    modelArr.push(doc)
                    console.log(doc);
                }
                return modelArr;
            }
        }
    } catch (error) {
        return error;
    }
}

module.exports = findService;
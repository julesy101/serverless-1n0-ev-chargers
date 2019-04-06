const partioner = require('../utilities/arrayPartitioner');
const assert = require('chai').assert;

describe("array partioner", () => {
    it("partition size should never exceed spacing parameter", () => {
        let toBeSplit = [10, 20, 30, 40, 50, 60];
        let spacing = 2;
        let split = partioner(toBeSplit, spacing);

        assert(split[0].length === spacing);
        assert(split[1].length === spacing);
        assert(split[2].length === spacing);

    });
    it("preserves input array ordering", () => {
        let toBeSplit = [10, 20, 30, 40, 50, 60];
        let split = partioner(toBeSplit, 2);

        assert.include(split[0], 10);
        assert.include(split[0], 20);

        assert.include(split[1], 30);
        assert.include(split[1], 40);

        assert.include(split[2], 50);
        assert.include(split[2], 60);
    });
    it("uneven array size for spacing should not truncate output", () => {
        let toBeSplit = [10, 20, 30, 40, 50];
        let split = partioner(toBeSplit, 2);

        assert.include(split[0], 10);
        assert.include(split[0], 20);

        assert.include(split[1], 30);
        assert.include(split[1], 40);

        assert.include(split[2], 50);
    });
});
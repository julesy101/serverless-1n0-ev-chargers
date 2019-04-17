// eslint-disable-next-line prefer-destructuring
const assert = require('chai').assert;
const partioner = require('../utilities/arrayPartitioner');

describe('array partioner', () => {
    it('partition size should never exceed spacing parameter', () => {
        const toBeSplit = [10, 20, 30, 40, 50, 60];
        const spacing = 2;
        const split = partioner(toBeSplit, spacing);

        assert(split[0].length === spacing);
        assert(split[1].length === spacing);
        assert(split[2].length === spacing);
    });
    it('preserves input array ordering', () => {
        const toBeSplit = [10, 20, 30, 40, 50, 60];
        const split = partioner(toBeSplit, 2);

        assert.include(split[0], 10);
        assert.include(split[0], 20);

        assert.include(split[1], 30);
        assert.include(split[1], 40);

        assert.include(split[2], 50);
        assert.include(split[2], 60);
    });
    it('uneven array size for spacing should not truncate output', () => {
        const toBeSplit = [10, 20, 30, 40, 50];
        const split = partioner(toBeSplit, 2);

        assert.include(split[0], 10);
        assert.include(split[0], 20);

        assert.include(split[1], 30);
        assert.include(split[1], 40);

        assert.include(split[2], 50);
    });
});

import { MockContext, Context, createMockContext } from './context'

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})

function beforeEach(arg0: () => void) {
  throw new Error('Function not implemented.')
}

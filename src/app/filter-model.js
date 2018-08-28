import { camelCase } from './util'
import { CreateModel } from 'keet'

class FilterModel extends CreateModel {
  switch (hash, obj) {
    this.list = this.list.map(filter =>
      filter.hash === hash ? ({ ...filter, ...obj }) : ({ ...filter, selected: false })
    )
  }
}

const filterModel = new FilterModel()

Array.from(['all', 'active', 'completed']).map(page =>
  filterModel.add({
    hash: `#/${page}`,
    name: camelCase(page),
    selected: false
  })
)

export default filterModel

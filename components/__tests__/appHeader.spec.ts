import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '../appHeader.vue'

describe('AppHeaderコンポーネント', () => {
  test('コンポーネントが正しくマウントされること', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.exists()).toBe(true)
  })

  test('デフォルトのタイトルが正しく表示されること', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.text()).toContain('population-graph-viewer')
  })

  test('propsで渡したタイトルが正しく表示されること', () => {
    const customTitle = 'カスタムタイトル'
    const wrapper = mount(AppHeader, {
      props: {
        title: customTitle
      }
    })
    expect(wrapper.text()).toContain(customTitle)
  })

  test('ヘッダーに正しいスタイルクラスが適用されていること', () => {
    const wrapper = mount(AppHeader)
    const header = wrapper.find('.header')
    
    expect(header.classes()).toContain('w-full')
    expect(header.classes()).toContain('bg-white')
    expect(header.classes()).toContain('text-3xl')
  })

  test('タイトルに正しいスタイルクラスが適用されていること', () => {
    const wrapper = mount(AppHeader)
    const title = wrapper.find('.title-color')
    
    expect(title.classes()).toContain('text-center')
    expect(title.classes()).toContain('font-bold')
  })
})
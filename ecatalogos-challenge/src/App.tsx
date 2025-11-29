import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { ChevronLeft, ChevronRight, Search, Info, ShoppingCart, Menu, ArrowLeft } from 'lucide-react';
import { useStore } from './store/useStore';
import { productsData } from './data/products';

// --- GLOBAL STYLES ---
const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Roboto', sans-serif; background-color: #f5f5f5; -webkit-font-smoothing: antialiased; }
  button { cursor: pointer; border: none; outline: none; background: none; }
`;

// --- STYLED COMPONENTS ---
const Container = styled.div`
  display: flex; flex-direction: column; height: 100vh; background-color: #f3f4f6;
  max-width: 480px; margin: 0 auto; border: 1px solid #e5e7eb; position: relative;
`;

const Header = styled.header`
  background: white; padding: 1rem; display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); z-index: 10;
`;

const CategoryTabs = styled.div`
  display: flex; gap: 1rem; overflow-x: auto; padding: 0.5rem 1rem; background: white; border-bottom: 1px solid #eee;
  &::-webkit-scrollbar { display: none; }
`;

const CategoryChip = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem; border-radius: 99px;
  background: ${props => props.$active ? '#000' : '#f3f4f6'};
  color: ${props => props.$active ? '#fff' : '#333'};
  font-weight: 500; font-size: 0.875rem; white-space: nowrap;
`;

const ProductArea = styled.div`
  flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; align-items: center;
`;

const Card = styled.div`
  background: white; border-radius: 1rem; padding: 1rem; width: 100%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; gap: 1rem;
`;

const ImageGallery = styled.div`
  display: flex; gap: 0.5rem; margin-bottom: 1rem; overflow-x: auto;
  img { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #eee; }
`;

const MainImage = styled.img`
  width: 100%; height: 250px; object-fit: contain; margin-bottom: 1rem;
`;

const ProductInfo = styled.div`
  h2 { font-size: 1.25rem; font-weight: bold; color: #1f2937; }
  p { color: #6b7280; font-size: 0.875rem; }
  .price { font-size: 1.5rem; font-weight: bold; color: #059669; margin-top: 0.5rem; }
`;

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-top: 1rem;
`;

const SizeBox = styled.div`
  display: flex; flex-direction: column; align-items: center; background: #f9fafb; padding: 0.5rem;
  border-radius: 0.5rem; border: 1px solid #e5e7eb;
  span:first-child { font-weight: bold; font-size: 0.875rem; }
  span:last-child { font-size: 0.75rem; color: #6b7280; }
`;

const Controls = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;
`;

const PackControl = styled.div`
  display: flex; align-items: center; gap: 1rem;
  button {
    width: 32px; height: 32px; border-radius: 50%; background: #e5e7eb; font-weight: bold; display: flex;
    align-items: center; justify-content: center;
    &:hover { background: #d1d5db; }
  }
  span { font-size: 1.25rem; font-weight: bold; min-width: 20px; text-align: center; }
`;

const Footer = styled.footer`
  background: white; padding: 1rem; border-top: 1px solid #e5e7eb;
`;

const SummaryRow = styled.div`
  display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;
  &.total { font-size: 1rem; font-weight: bold; color: #059669; border-top: 1px dashed #e5e7eb; padding-top: 0.5rem; margin-top: 0.5rem; }
`;

const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center; z-index: 50;
`;
const ModalContent = styled.div`
  background: white; padding: 2rem; border-radius: 8px; max-width: 90%; width: 300px;
  h3 { font-size: 1.25rem; margin-bottom: 1rem; font-weight: bold; }
`;

// --- APP COMPONENT ---
function App() {
  const { currentProductIndex, nextProduct, prevProduct, cart, setPackQuantity, getProductTotal, getGrandTotal } = useStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const product = productsData[currentProductIndex];
  if (!product) {
    return <div style={{ padding: 20 }}>Erro: Dados do produto não encontrados. Verifique o arquivo data/products.ts</div>;
  }
  const cartItem = cart.find(item => item.productReference === product.reference);
  const currentPacks = cartItem ? cartItem.packs : 0;
  const currentTotal = getProductTotal(product);
  const grandTotal = getGrandTotal();

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          {/* Ícone de voltar (fake) */}
          <ArrowLeft size={24} color="#666" style={{ cursor: 'not-allowed' }} />

          {/* Título Centralizado com um visual melhor */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Força de Vendas</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Nova Compra</span>
          </div>

          {/* Menu Hamburguer (fake) */}
          <Menu size={24} color="#666" style={{ cursor: 'not-allowed' }} />
        </Header>

        <CategoryTabs>
          <CategoryChip $active>Todos</CategoryChip>
          <CategoryChip>Masculino</CategoryChip>
          <CategoryChip>Feminino</CategoryChip>
          <CategoryChip>Infantil</CategoryChip>
        </CategoryTabs>

        <ProductArea>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <button onClick={() => setIsSearchOpen(true)}><Search size={20} color="#4b5563" /></button>
            <button onClick={() => setIsInfoOpen(true)}><Info size={20} color="#4b5563" /></button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '0.5rem' }}>
            <button onClick={prevProduct}><ChevronLeft size={32} /></button>

            <Card>
              <MainImage src={product.images[0]?.path} alt={product.name} />
              <ImageGallery>
                {product.images.map(img => (
                  <img key={img.id} src={img.path} alt="" />
                ))}
              </ImageGallery>

              <ProductInfo>
                <h2>{product.name}</h2>
                <p>Ref: {product.reference}</p>
                <div className="price">R$ {product.skus[0]?.price.replace('.', ',')}</div>
              </ProductInfo>

              <div style={{ fontSize: '0.875rem', fontWeight: 'bold', marginTop: '0.5rem' }}>Grade (Por Pack):</div>
              <Grid>
                {product.skus.map(sku => (
                  <SizeBox key={sku.id}>
                    <span>{sku.size}</span>
                    <span>{sku.minQuantity} un</span>
                  </SizeBox>
                ))}
              </Grid>

              <Controls>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Packs:</div>
                <PackControl>
                  <button onClick={() => setPackQuantity(product.reference, currentPacks - 1)}>-</button>
                  <span>{currentPacks}</span>
                  <button onClick={() => setPackQuantity(product.reference, currentPacks + 1)}>+</button>
                </PackControl>
              </Controls>
            </Card>

            <button onClick={nextProduct}><ChevronRight size={32} /></button>
          </div>
        </ProductArea>

        <Footer>
          <SummaryRow>
            <span>Atual ({currentPacks} packs):</span>
            <span style={{ marginLeft: 'auto', marginRight: '10px' }}>{currentTotal.items} peças</span>
            <span>{formatMoney(currentTotal.price)}</span>
          </SummaryRow>
          <SummaryRow className="total">
            <span>Acumulado:</span>
            <span style={{ marginLeft: 'auto', marginRight: '10px' }}>{grandTotal.items} peças</span>
            <span>{formatMoney(grandTotal.price)}</span>
          </SummaryRow>

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem' }}>
              <ShoppingCart size={24} style={{ margin: '0 auto' }} />
              <div>Carrinho</div>
            </div>
            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem' }}>
              <div style={{ width: 24, height: 24, background: '#eee', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>F</div>
              <div>Funções</div>
            </div>
          </div>
        </Footer>

        {isSearchOpen && (
          <ModalOverlay onClick={() => setIsSearchOpen(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <h3>Buscar Produto</h3>
              <input type="text" placeholder="Digite a referência..." style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              <button onClick={() => setIsSearchOpen(false)} style={{ marginTop: '1rem', background: '#000', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>Fechar</button>
            </ModalContent>
          </ModalOverlay>
        )}

        {isInfoOpen && (
          <ModalOverlay onClick={() => setIsInfoOpen(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <h3>Detalhes</h3>
              <p><strong>Descrição:</strong> {product.description || "Sem descrição."}</p>
              <p><strong>Cor:</strong> {product.hexCode ? <span style={{ display: 'inline-block', width: 12, height: 12, background: product.hexCode, borderRadius: '50%' }}></span> : 'N/A'}</p>
              <button onClick={() => setIsInfoOpen(false)} style={{ marginTop: '1rem', background: '#000', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>Fechar</button>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </>
  );
}

export default App;
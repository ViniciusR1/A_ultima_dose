import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import vinhoVinhaArdanche from '../../assets/vinhovinãardanche.png';
import vinhoUnearthed from '../../assets/vinhounearthed.png';
import vinhoTemeria from '../../assets/vinhoteméria.png';
import vinhoSonoVineyards from '../../assets/vinhosonomavineyards.png';
import vinhoNightjar from '../../assets/vinhonightjar.png';
import vinhoImperius from '../../assets/vinhoimperius.png';
import vinhoGoguWinery from '../../assets/vinhogoguwinery.png';
import vinhoDupla1901 from '../../assets/vinhodupla1901.png';
import vinhoDragonfly from '../../assets/vinhodragonfly.png';
import vinhoDalva from '../../assets/vinhodalva.png';
import vinhoCuoreDelle from '../../assets/vinhocuoredelle.png';
import vinhoChateau from '../../assets/vinhochateaudelacouronne.png';
import cervejaVinbanbami from '../../assets/cervejavinbanbami.png';
import cervejaSvyllaPremium from '../../assets/cervejaSvyllaPremium.png';
import cervejaOndom from '../../assets/cervejaondom.png';
import cervejaBoamans from '../../assets/cervejaboamans.png';
import cervejaBlackstone from '../../assets/cervejablackstone.png';
import cervejaAV from '../../assets/cervejaav.png';
import './ProductCard.css';

const categoryLabels = {
  wine_red: 'Vinhos Tintos',
  wine_white: 'Vinhos Brancos',
  wine_rose: 'Vinhos Rosés',
  sparkling: 'Espumantes',
  craft_beer: 'Cervejas',
  other: 'Outros',
};

const PRODUCT_VISUALS = {
  'Bodegas Norton Malbec Reserva': { title: 'Vinho Vinã Ardanche', image: vinhoVinhaArdanche },
  'Casillero del Diablo Cabernet Sauvignon': { title: 'Vinho Unearthed', image: vinhoUnearthed },
  'Don Melchor Cabernet Sauvignon': { title: 'Vinho Teméria', image: vinhoTemeria },
  'Quinta do Crasto LBV Porto': { title: 'Vinho Sono Vineyards', image: vinhoSonoVineyards },
  'Santa Helena Sauvignon Blanc': { title: 'Vinho Nightjar', image: vinhoNightjar },
  'Miolo Chablis Premier Cru': { title: 'Vinho Imperius', image: vinhoImperius },
  'Vermentino Sardinia IGT': { title: 'Vinho Gogu Winery', image: vinhoGoguWinery },
  'Whispering Angel Provence Rosé': { title: 'Dupla 1901', image: vinhoDupla1901 },
  'Ramón Bilbao Rosado': { title: 'Vinho Dragonfly', image: vinhoDragonfly },
  'Chandon Brut Rosé': { title: 'Vinho Dalva', image: vinhoDalva },
  'Perrier-Jouët Grand Brut Champagne': { title: 'Vinho Cuore Delle Cotarella', image: vinhoCuoreDelle },
  'Cave Geisse Blanc de Blancs': { title: 'Chateau de La Couronne', image: vinhoChateau },
  'Dogma American IPA': { title: 'Vinbanbami', image: cervejaVinbanbami },
  'Bodebrown Bohemian Pilsner': { title: 'Svylla Premium', image: cervejaSvyllaPremium },
  'Wäls Quadruppel': { title: 'Cerveja Ondom', image: cervejaOndom },
  'Seasons Nectarine Sour': { title: 'Boamans', image: cervejaBoamans },
  'Tupiniquim Coffee Stout': { title: 'Cerveja BlackStone', image: cervejaBlackstone },
  'Colorado Appia': { title: 'Cerveja AV', image: cervejaAV },
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const visual = PRODUCT_VISUALS[product.name] || {};
  const displayName = visual.title || product.name;
  const imageSrc = visual.image || product.image_url;
  const displayDescription = product.description || '';

  const handleAdd = () => {
    addItem(product);
    toast.success(`${displayName} adicionado!`, { icon: '🍷' });
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {imageSrc
          ? <img src={imageSrc} alt={displayName} loading="lazy" />
          : <div className="product-image-placeholder">🍷</div>
        }
        <span className="product-category">{categoryLabels[product.category] || product.category}</span>
        {product.stock === 0 && <span className="product-out-of-stock">Esgotado</span>}
      </div>
      <div className="product-body">
        <h3 className="product-name">{displayName}</h3>
        {displayDescription && <p className="product-desc">{displayDescription}</p>}
        <div className="product-meta">
          {product.alcohol_content && <span>{product.alcohol_content}% alc.</span>}
          {product.volume && <span>{product.volume}ml</span>}
        </div>
        <div className="product-footer">
          <span className="product-price">R$ {Number(product.price).toFixed(2)}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            <ShoppingCart size={14} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

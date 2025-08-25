package TT.s.Science;

public class Skup {
    private fieldState[][][] elements;

    private int size;

    public Skup(){
        this.elements = new fieldState[8][3][3];
        this.size = 0;
    }

    public void add(fieldState[][] e){
        if(size == 8) return;
        for(int i = 0; i < 3; i++){
            for(int j = 0; j < 3; j++){
                elements[size][i][j] = e[i][j];
            }
        }
        size++;
    }

    public boolean contains(fieldState[][] e){
        for(int i = 0; i < size; i++){
            int b = 0;
            for(int x = 0; x < 3; x++){
                for(int y = 0; y < 3; y++){
                    if(e[x][y] == elements[i][x][y]) b++;
                }
            }
            if(b == 9) return true;
        }
        return false;
    }

    public int size(){
        return size;
    }

    public fieldState[][] get(int l){
        return elements[l];
    }

    public void print(){
        for(int i = 0; i < 8; i++){
            System.out.print("|");
            for(int j = 0; j < 3; j++){
                for(int k = 0; k < 3; k++){
                    if(elements[i][j][k] == fieldState.CROS) System.out.print("X");
                    else if(elements[i][j][k] == fieldState.CIRCLE) System.out.print("O");
                    else System.out.print(" ");
                }
            }
            System.out.println("|");
        }
        System.out.println("||");
    }

    public int brElem(){
        int br = 0;
        for(int i = 0; i < 3; i++){
            for(int j = 0; j < 3; j++){
                if(elements[0][i][j] != fieldState.EMPTY) br++;
            }
        }
        return br;
    }

}
